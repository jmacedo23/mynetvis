# backend/app/models/traffic.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TrafficData(BaseModel):
    id: int
    source_ip: str
    destination_ip: str
    bytes_transferred: int
    timestamp: datetime

class TrafficQuery(BaseModel):
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
