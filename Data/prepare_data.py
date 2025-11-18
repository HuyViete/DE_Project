# Business rule: 2 warehouses, each with 3 production lines, each line has batches, each batch holds up to 120 products
# Batch_ID struture: <Line_ID (1 digits)><Batch_Sequence (3 digits)>

import os
import pandas as pd
import mysql.connector
import sys

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

def setup_master_data(cursor):
    try:
        cursor.execute("INSERT IGNORE INTO Users (user_id, username, role) VALUES (1, 'default_tester', 'Tester');")
        cursor.execute("INSERT IGNORE INTO Tester (user_id, flavor_profile) VALUES (1, 'N/A');")

        warehouses = [
            (1, 'Primary Production'),
            (2, 'Secondary Production')
        ]
        lines = [
            (1, 1), (2, 1), (3, 1),
            (4, 2), (5, 2), (6, 2)
        ]

        cursor.executemany("INSERT IGNORE INTO Warehouse (warehouse_id, categories) VALUES (%s, %s);", warehouses)
        cursor.executemany("INSERT IGNORE INTO Line (line_id, warehouse_id) VALUES (%s, %s);", lines)
        
        print("Master data is set up (Users, Warehouses, Lines).")
    except mysql.connector.Error as err:
        print(f"Error setting up master data: {err}")


def load_data_for_warehouse(cursor, df, warehouse_id, line_ids):
    TESTER_ID = 1
    PRODUCTS_PER_BATCH = 120  # Fixed business rule: batch holds up to 120 products

    total_records_loaded = 0

    # Initialize per-line batch sequence from DB using existing composite IDs if present
    seq_map = {line_id: 0 for line_id in line_ids}
    placeholders = ",".join(["%s"] * len(line_ids))
    cursor.execute(
        f"SELECT line_id, MAX(batch_id) AS max_id FROM Batches WHERE line_id IN ({placeholders}) GROUP BY line_id",
        tuple(line_ids),
    )
    for row in cursor.fetchall() or []:
        line, max_id = row[0], row[1]
        if max_id is not None:
            # If composite scheme already used, next seq is max_id % 1000; else start from 0
            try:
                seq_map[line] = int(max_id) % 1000
            except Exception:
                seq_map[line] = 0

    print(f"Starting data load for Warehouse {warehouse_id}")

    # Create batches in a round-robin across the given lines until all rows are loaded
    while total_records_loaded < len(df):
        for line_id in line_ids:
            if total_records_loaded >= len(df):
                break

            # Compose next batch_id as <line_id><seq> with 3 digits each
            seq_map[line_id] = seq_map[line_id] + 1
            composed_batch_id = line_id * 1000 + seq_map[line_id]

            # Create the new batch for this line with composed id
            sql_batch = "INSERT INTO Batches (batch_id, line_id) VALUES (%s, %s)"
            cursor.execute(sql_batch, (composed_batch_id, line_id))

            # Determine the slice of data for this batch
            start_index = total_records_loaded
            end_index = min(total_records_loaded + PRODUCTS_PER_BATCH, len(df))
            batch_df = df.iloc[start_index:end_index]

            if batch_df.empty:
                continue

            # Load products for the current batch
            for _, row in batch_df.iterrows():
                sql_product = """
                    INSERT INTO Product (
                        batch_id, density, chlorides, alcohol, sulphates, pH,
                        fixed_acidity, citric_acid, volatile_acidity,
                        free_sulfur_dioxide, total_sulfur_dioxide, residual_sugar
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                product_data = (
                    composed_batch_id,
                    row['density'], row['chlorides'], row['alcohol'], row['sulphates'], row['pH'],
                    row['fixed acidity'], row['citric acid'], row['volatile acidity'],
                    row['free sulfur dioxide'], row['total sulfur dioxide'], row['residual sugar']
                )
                cursor.execute(sql_product, product_data)
                product_id = cursor.lastrowid

                sql_test = "INSERT INTO Test_random (score, tester_id, product_id) VALUES (%s, %s, %s)"
                cursor.execute(sql_test, (row['quality'], TESTER_ID, product_id))

            total_records_loaded += len(batch_df)
            print(f"  Loaded {len(batch_df)} products into Batch {str(line_id).zfill(3)}{str(seq_map[line_id]).zfill(3)} for Line {line_id}")

    print(f"All available data has been loaded for warehouse {warehouse_id}.")
    # Return last composed ids per line (max) to the caller if needed (unused for now)
    return total_records_loaded, max((line_id * 1000 + seq) for line_id, seq in seq_map.items())

def process_and_load_data(conn):
    cursor = conn.cursor()
    
    try:                                            
        setup_master_data(cursor)

        try:
            df = pd.read_csv('winequalityN.csv')
        except FileNotFoundError:
            print("Error: 'winequalityN.csv' file not found.")
            return

        numeric_cols = df.select_dtypes(include=['number']).columns
        object_cols = df.select_dtypes(include=['object']).columns
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        for col in object_cols:
            most_frequent_value = df[col].mode()[0]
            df[col] = df[col].fillna(most_frequent_value)
        print("Finished cleaning up missing (NaN) values.")

        # --- Data partitioning & replication ---
        cycles = int(os.getenv("FACTORY_LOAD_CYCLES", "1"))
        if cycles < 1:
            cycles = 1
        df_wh1 = df  # full dataset for factory 1
        df_wh2_base = df_wh1  # duplicate base for factory 2
        wh1_cycles = [df_wh1 for _ in range(cycles)]
        wh2_cycles = [df_wh2_base.sample(frac=1).reset_index(drop=True) for _ in range(cycles)]

        # --- Load data for each factory (warehouse) ---
        total_loaded = 0

        # Factory 1 (Warehouse 1) cycles
        for cycle_index, df_cycle in enumerate(wh1_cycles, start=1):
            print(f"-- Loading Factory 1 Cycle {cycle_index}/{cycles} --")
            loaded_wh1, _ = load_data_for_warehouse(
                cursor, df_cycle, warehouse_id=1, line_ids=[1, 2, 3]
            )
            total_loaded += loaded_wh1

        # Factory 2 (Warehouse 2) cycles (shuffled each cycle)
        for cycle_index, df_cycle in enumerate(wh2_cycles, start=1):
            print(f"-- Loading Factory 2 Cycle {cycle_index}/{cycles} --")
            loaded_wh2, _ = load_data_for_warehouse(
                cursor, df_cycle, warehouse_id=2, line_ids=[4, 5, 6]
            )
            total_loaded += loaded_wh2

        conn.commit()
        print(f"All done! Loaded a total of {total_loaded} records into the DB.")

    except mysql.connector.Error as err:
        print(f"Error while loading data: {err}")
        conn.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    conn = get_db_connection()
    if conn.is_connected():
        process_and_load_data(conn)
        conn.close()
        print("Database connection closed.")