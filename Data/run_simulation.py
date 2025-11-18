import time
import sys
import random

import pandas as pd
import mysql.connector

# --- STEP 1: DATABASE CONNECTION STUFF ---
DB_CONFIG = {
    'host': '127.0.0.1', 
    'user': 'root',
    'password': 'Quockhanh1?',
    'database': 'wine_production'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Database connection error: {err}")
        sys.exit(1)


def run_simulation(conn):
    cursor = conn.cursor()

    try:
        # --- Read the full data file and randomize order ---
        try:
            sim_df = pd.read_csv('winequalityN.csv').sample(frac=1).reset_index(drop=True)
        except FileNotFoundError:
            print("Error: 'winequalityN.csv' not found.")
            print("Ensure the CSV file is present before running the simulation.")
            return

        print(f"Starting 'Sensor Rig' simulation with {len(sim_df)} randomly ordered products across 6 lines...")
        print("Press Ctrl+C to stop.")

        # --- BATCH LOGIC SETUP ---
        LINES = [1, 2, 3, 4, 5, 6]
        PRODUCTS_PER_BATCH = 120

        # Initialize per-line sequence (last 3 digits) and current batch info
        seq_map = {line: 0 for line in LINES}
        current_batch_for_line = {line: None for line in LINES}
        current_count_for_line = {line: 0 for line in LINES}

        placeholders = ",".join(["%s"] * len(LINES))
        cursor.execute(
            f"SELECT line_id, MAX(batch_id) AS max_id FROM Batches WHERE line_id IN ({placeholders}) GROUP BY line_id",
            tuple(LINES),
        )
        for line_id, max_id in cursor.fetchall() or []:
            if max_id is not None:
                try:
                    seq_map[line_id] = int(max_id) % 1000
                except Exception:
                    seq_map[line_id] = 0

        # --- MAIN SIMULATION LOOP ---
        for _, row in sim_df.iterrows():
            # Randomly choose a line for this product
            line_id = random.choice(LINES)

            # If starting a new batch for this line (first product or batch full), create batch
            if current_batch_for_line[line_id] is None or current_count_for_line[line_id] >= PRODUCTS_PER_BATCH:
                seq_map[line_id] += 1
                composed_batch_id = line_id * 1000 + seq_map[line_id]
                cursor.execute(
                    "INSERT INTO Batches (batch_id, line_id) VALUES (%s, %s)",
                    (composed_batch_id, line_id),
                )
                current_batch_for_line[line_id] = composed_batch_id
                current_count_for_line[line_id] = 0
                print(
                    f"Created new Simulation Batch ID: {str(line_id).zfill(3)}{str(seq_map[line_id]).zfill(3)} for Line {line_id}"
                )

            # Insert the new product
            sql_product = """
                INSERT INTO Product (
                    batch_id, density, chlorides, alcohol, sulphates, pH,
                    fixed_acidity, citric_acid, volatile_acidity,
                    free_sulfur_dioxide, total_sulfur_dioxide, residual_sugar
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            product_data = (
                current_batch_for_line[line_id],
                row['density'], row['chlorides'], row['alcohol'], row['sulphates'], row['pH'],
                row['fixed acidity'], row['citric acid'], row['volatile acidity'],
                row['free sulfur dioxide'],
                row['total sulfur dioxide'],
                row['residual sugar'],
            )
            cursor.execute(sql_product, product_data)
            product_id = cursor.lastrowid

            conn.commit()

            current_count_for_line[line_id] += 1

            print(
                f"[SENSOR SIM] Inserted Product ID: {product_id} (Batch: {str(line_id).zfill(3)}{str(seq_map[line_id]).zfill(3)}, Line: {line_id}, CountInBatch: {current_count_for_line[line_id]})"
            )

            time.sleep(1)

        print("--- Simulation Finished ---")

    except mysql.connector.Error as err:
        print(f"Error during simulation: {err}")
        conn.rollback()
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
    finally:
        cursor.close()


if __name__ == "__main__":
    conn = get_db_connection()
    if conn.is_connected():
        run_simulation(conn)
        conn.close()
        print("Database connection closed.")