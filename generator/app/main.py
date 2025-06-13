try:
    from .fetch import fetch_and_store_tles
    from .ground_stations import insert_ground_stations
except ImportError:
    # Fallback when executed as a script without a package context
    from fetch import fetch_and_store_tles
    from ground_stations import insert_ground_stations
import time

if __name__ == "__main__":
    insert_ground_stations()
    while True:
        fetch_and_store_tles()
        time.sleep(3600)  # update every hour
