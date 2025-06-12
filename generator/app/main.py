try:
    from .fetch import fetch_and_store_tles
except ImportError:
    # Fallback when executed as a script without a package context
    from fetch import fetch_and_store_tles
import time

if __name__ == "__main__":
    while True:
        fetch_and_store_tles()
        time.sleep(3600)  # update every hour
