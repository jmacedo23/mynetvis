from fastapi import FastAPI
import psycopg2
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "NetVis API is live!"}

@app.get("/satellites")
def get_satellite_data():
    # Connect to the TimescaleDB database
    conn = psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=5432
    )

    cur = conn.cursor()
    cur.execute("SELECT * FROM satellite_positions LIMIT 10;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    # Convert raw tuples into dicts (optional)
    data = [
        {
            "time_sec": r[0],
            "obj_id": r[1],
            "lat": r[2],
            "lon": r[3],
            "alt_km": r[4],
        }
        for r in rows
    ]

    return {"data": data}
