# NetVis
Inspired by TorFlow. Network traffic visualization with a focus on satellite constellations.

## Containers
- **frontend**: React application
- **backend**: FastAPI service providing satellite data
- **database**: TimescaleDB instance storing TLEs
- **generator**: Fetches TLEs from Celestrak and populates the database

## Data Pipeline

1. **Generator** fetches the latest Starlink TLEs every hour and inserts them
   into the `satellite_tles` hypertable inside the TimescaleDB container. On
   startup it also ensures a `ground_stations` table exists and fills it with ten
   major city coordinates.
2. **Backend** queries the latest TLE for each satellite and the list of ground
   stations, calculates satellite positions and short term orbital paths and
   exposes this information through the API.
3. **Frontend** periodically calls the backend API and uses Cesium to animate
   the satellites and display the ground stations on the 3D globe view.
