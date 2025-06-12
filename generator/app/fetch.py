import requests
import psycopg2
from psycopg2 import OperationalError
from datetime import datetime
import os
import time

CELESTRAK_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle"

def wait_for_db(max_retries=10, delay=3):
    retries = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST", "database"),
                dbname=os.getenv("POSTGRES_DB", "netvis"),
                user=os.getenv("POSTGRES_USER", "netvis"),
                password=os.getenv("POSTGRES_PASSWORD", "netvis"),
                port=os.getenv("POSTGRES_PORT", "5432")
            )
            print("✅ Connected to TimescaleDB.")
            return conn
        except OperationalError as e:
            print(f"⏳ Database not ready ({e}), retrying in {delay}s...")
            retries += 1
            time.sleep(delay)
    raise Exception("❌ Could not connect to TimescaleDB after multiple retries.")

def fetch_and_store_tles():
    try:
        response = requests.get(CELESTRAK_URL)
        response.raise_for_status()
        lines = response.text.strip().splitlines()
    except Exception as e:
        print("❌ Failed to fetch TLEs:", e)
        return

    conn = wait_for_db()
    cur = conn.cursor()
    now = datetime.utcnow().isoformat()

    for i in range(0, len(lines), 3):
        try:
            name = lines[i].strip()
            tle_line1 = lines[i + 1].strip()
            tle_line2 = lines[i + 2].strip()
            sat_id = tle_line1.split()[1]

            cur.execute("""
                INSERT INTO satellite_tles (satellite_id, name, tle_line1, tle_line2, epoch)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING;
            """, (sat_id, name, tle_line1, tle_line2, now))
        except Exception as e:
            print(f"❌ Error inserting {name}: {e}")

    conn.commit()
    cur.close()
    conn.close()
    print("✅ TLEs stored successfully.")
