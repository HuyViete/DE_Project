import os
import sys
import time
import json
import uuid

import pandas as pd

try:
    import paho.mqtt.client as mqtt
except ImportError:
    print("Missing dependency: paho-mqtt. Install with:\n  C:/Python314/python.exe -m pip install paho-mqtt")
    sys.exit(1)

# --- Configuration (override via environment variables) ---
MQTT_HOST = os.getenv("MQTT_HOST", "127.0.0.1")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "wine/simulation")
PUBLISH_DELAY_SEC = float(os.getenv("PUBLISH_DELAY_SEC", "1.5"))
CSV_PATH = os.getenv("CSV_PATH", "winequalityN.csv")
SHUFFLE = os.getenv("SHUFFLE", "1") not in {"0", "false", "False"}


def get_mqtt_client():
    client = mqtt.Client(client_id=f"simulator-{uuid.uuid4()}")

    def on_connect(cli, userdata, flags, rc, properties=None):
        if rc == 0:
            print(f"[MQTT] Connected to {MQTT_HOST}:{MQTT_PORT}")
        else:
            print(f"[MQTT] Connection failed with code {rc}")

    client.on_connect = on_connect
    client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
    return client


def load_dataset(path: str, shuffle: bool = True) -> pd.DataFrame:
    try:
        df = pd.read_csv(path)
    except FileNotFoundError:
        print(f"Error: '{path}' not found. Set CSV_PATH or place the file next to this script.")
        sys.exit(1)
    if shuffle:
        df = df.sample(frac=1).reset_index(drop=True)
    return df


def row_to_message(row: pd.Series) -> dict:
    return {
        "message_id": str(uuid.uuid4()),
        "timestamp": time.time(),
        "payload": {
            "density": float(row["density"]),
            "chlorides": float(row["chlorides"]),
            "alcohol": float(row["alcohol"]),
            "sulphates": float(row["sulphates"]),
            "pH": float(row["pH"]),
            "fixed_acidity": float(row["fixed acidity"]),
            "citric_acid": float(row["citric acid"]),
            "volatile_acidity": float(row["volatile acidity"]),
            "free_sulfur_dioxide": float(row["free sulfur dioxide"]),
            "total_sulfur_dioxide": float(row["total sulfur dioxide"]),
            "residual_sugar": float(row["residual sugar"]),
            # Include label if present for reference; downstream can ignore
            "quality": None if pd.isna(row.get("quality", None)) else float(row["quality"]),
        },
    }


def main():
    print(f"Loading dataset from '{CSV_PATH}' (shuffle={SHUFFLE})...")
    df = load_dataset(CSV_PATH, shuffle=SHUFFLE)
    print(f"Loaded {len(df)} rows. Publishing to '{MQTT_TOPIC}' at {MQTT_HOST}:{MQTT_PORT}...")

    client = get_mqtt_client()
    client.loop_start()

    try:
        for _, row in df.iterrows():
            msg = row_to_message(row)
            payload = json.dumps(msg)
            info = client.publish(MQTT_TOPIC, payload=payload, qos=1)
            # Optionally wait for publish to complete
            info.wait_for_publish()
            print(f"[SENSOR SIM] Published {msg['message_id']} -> topic '{MQTT_TOPIC}'")
            time.sleep(PUBLISH_DELAY_SEC)

        print("--- MQTT Simulation Finished ---")
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
    finally:
        client.loop_stop()
        client.disconnect()
        print("MQTT connection closed.")


if __name__ == "__main__":
    main()
