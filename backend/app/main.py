from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from datetime import datetime
from skyfield.api import EarthSatellite, load
import os
from app.tle.fetch import fetch_and_store_tles


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    fetch_and_store_tles()

@app.get("/api/update-tles")
def manual_tle_update():
    fetch_and_store_tles()
    return {"status": "TLEs updated"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/satellites/positions")
def get_all_satellite_positions():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=5432
    )
    cur = conn.cursor()

    # NOTE: Ensure 'epoch' is stored as a TIMESTAMP type in your table
    cur.execute("""
        SELECT t1.satellite_id, t1.tle_line1, t1.tle_line2
        FROM satellite_tles t1
        INNER JOIN (
            SELECT satellite_id, MAX(epoch) AS max_epoch
            FROM satellite_tles
            GROUP BY satellite_id
        ) t2
        ON t1.satellite_id = t2.satellite_id AND t1.epoch = t2.max_epoch
    """)
    results = cur.fetchall()
    cur.close()
    conn.close()

    ts = load.timescale()
    now = ts.now()

    satellites = []
    for satellite_id, tle1, tle2 in results:
        try:
            sat = EarthSatellite(tle1.strip(), tle2.strip(), satellite_id, ts)
            subpoint = sat.at(now).subpoint()
            alt_km = subpoint.elevation.km
            satellites.append({
                "satellite_id": satellite_id,
                "lat": subpoint.latitude.degrees,
                "lon": subpoint.longitude.degrees,
                "alt_km": alt_km
            })
        except Exception as e:
            continue  # Skip bad TLEs

    return {"satellites": satellites}
