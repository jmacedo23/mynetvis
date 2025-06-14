from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from datetime import datetime, timedelta
import os

from skyfield.api import EarthSatellite, load
from sgp4.api import Satrec, jday

app = FastAPI()


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
            satellites.append({
                "satellite_id": satellite_id,
                "lat": subpoint.latitude.degrees,
                "lon": subpoint.longitude.degrees,
                "alt_km": subpoint.elevation.km
            })
        except Exception:
            continue

    return {"satellites": satellites}

@app.get("/satellites/paths")
def get_satellite_paths():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=5432
    )
    cur = conn.cursor()
    cur.execute("""
        SELECT t1.satellite_id, t1.name, t1.tle_line1, t1.tle_line2
        FROM satellite_tles t1
        INNER JOIN (
            SELECT satellite_id, MAX(epoch) AS max_epoch
            FROM satellite_tles
            GROUP BY satellite_id
        ) t2
        ON t1.satellite_id = t2.satellite_id AND t1.epoch = t2.max_epoch
        LIMIT 50;
    """)
    results = cur.fetchall()
    cur.close()
    conn.close()

    now = datetime.utcnow()
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day + timedelta(days=1)
    satellites = []

    for satellite_id, name, tle1, tle2 in results:
        try:
            sat = Satrec.twoline2rv(tle1, tle2)
            path = []

            total_seconds = int((end_of_day - start_of_day).total_seconds())
            for t in range(0, total_seconds + 1, 60):  # every 1 min for 24 hours
                dt = start_of_day + timedelta(seconds=t)
                jd, fr = jday(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
                err, pos, _ = sat.sgp4(jd, fr)
                if err == 0:
                    x, y, z = pos
                    path.append({
                        "timestamp": dt.isoformat() + "Z",
                        "x": x,
                        "y": y,
                        "z": z
                    })

            satellites.append({
                "satellite_id": satellite_id,
                "name": name,
                "path": path
            })
        except Exception:
            continue

    return satellites

@app.get("/ground-stations")
def get_ground_stations():
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=5432,
    )
    cur = conn.cursor()
    cur.execute("SELECT name, lat, lon FROM ground_stations;")
    stations = [
        {"name": name, "lat": lat, "lon": lon}
        for name, lat, lon in cur.fetchall()
    ]
    cur.close()
    conn.close()
    return stations
