from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Traffic(Base):
    __tablename__ = "traffic"
    id = Column(String, primary_key=True)
    source = Column(String)
    destination = Column(String)
    bandwidth = Column(Float)
    timestamp = Column(DateTime)
