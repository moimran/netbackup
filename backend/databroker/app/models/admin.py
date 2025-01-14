from sqlalchemy import Column, String, DateTime, Integer
from ..database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime)
    last_login = Column(DateTime)

    def __init__(self, username: str, role: str = "admin"):
        self.username = username
        self.role = role
