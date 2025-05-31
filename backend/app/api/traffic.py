from fastapi import APIRouter
from app.models.traffic import TrafficData
import pandas as pd

router = APIRouter()

@router.get("/", response_model=list[TrafficData])
def get_traffic():
    df = pd.read_excel("data/Example-Converted.xlsx")
    records = df.to_dict(orient="records")
    return [TrafficData(**r) for r in records]
