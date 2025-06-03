from fastapi import FastAPI
from app.api import traffic
from app.websocket import traffic_ws
from db.init import init_db
from db.connection import engine

app = FastAPI()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await init_db(engine)

# REST API routes
app.include_router(traffic.router, prefix="/traffic")

# WebSocket routes
app.include_router(traffic_ws.router)
