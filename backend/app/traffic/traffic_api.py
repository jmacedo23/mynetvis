from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.connection import get_db
from app.models.db_models import Traffic

router = APIRouter(prefix="/traffic")

@router.get("/")
async def get_all_traffic(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Traffic))
    return result.scalars().all()
