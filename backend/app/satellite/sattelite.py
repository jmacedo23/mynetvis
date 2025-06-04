from skyfield.api import EarthSatellite, load
from fastapi import APIRouter
from datetime import datetime
import pytz

router = APIRouter()

# TLE data
line1 = "1 25544U 98067A   24154.53194444  .00007048  00000+0  13058-3 0  9993"
line2 = "2 25544  51.6432  25.2738 0004345 295.2718 112.2081 15.50815939393825"
satellite = EarthSatellite(line1, line2, "ISS", load.timescale())
ts = load.timescale()

@router.get("/satellite/iss")
def get_iss_position():
    t = ts.now()
    geocentric = satellite.at(t)
    subpoint = geocentric.subpoint()
    return {
        "lat": subpoint.latitude.degrees,
        "lon": subpoint.longitude.degrees,
        "alt": subpoint.elevation.km,
        "timestamp": datetime.now(pytz.UTC).isoformat()
    }
