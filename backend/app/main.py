# backend/app/main.py

from fastapi import FastAPI
from app.api import traffic, status

app = FastAPI()

app.include_router(status.router, prefix="/status")
app.include_router(traffic.router, prefix="/traffic")

