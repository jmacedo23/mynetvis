from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db.connection import get_db
from app.models.traffic import TrafficRecord
from db.models import Traffic

router = APIRouter()

@router.get("/", response_model=list[TrafficRecord])
async def get_all_traffic(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Traffic))
    return result.scalars().all()
