import asyncio
import uuid
import random
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.db_models import Traffic
from database.connection import async_session

NODES = ['A', 'B', 'C', 'D']  # replace with actual node data

async def generate_and_insert_traffic(session: AsyncSession):
    for _ in range(10):
        source, dest = random.sample(NODES, 2)
        bandwidth = round(random.uniform(10.0, 1000.0), 2)

        traffic = Traffic(
            id=str(uuid.uuid4()),
            source=source,
            destination=dest,
            bandwidth=bandwidth,
            timestamp=datetime.utcnow()
        )
        session.add(traffic)
    await session.commit()

async def main():
    while True:
        async with async_session() as session:
            await generate_and_insert_traffic(session)
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
