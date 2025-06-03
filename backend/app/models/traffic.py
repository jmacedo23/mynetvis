# backend/app/models/traffic.py
from pydantic import BaseModel
from datetime import datetime

class TrafficRecord(BaseModel):
    id: str
    source: str
    destination: str
    bandwidth: float
    timestamp: datetime

    class Config:
        from_attributes = True  # enables ORM-to-Pydantic conversion
