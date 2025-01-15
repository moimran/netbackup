from sqlalchemy import Column, String, DateTime, event
from ..database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime)
    last_login = Column(DateTime)

    def __init__(self, username: str, email: str, password: str, role: str = "admin", status: str = "active", id: str = None):
        from datetime import datetime
        from ..schemas.admin_schemas import AdminRole, AdminStatus
        
        self.username = username
        self.email = email
        self.password = password
        self.role = role if isinstance(role, str) else role.value
        self.status = status if isinstance(status, str) else status.value
        self.created_at = datetime.utcnow()
        self.last_login = None
        if id:
            self.id = id

    @classmethod
    def __declare_last__(cls):
        from datetime import datetime
        @event.listens_for(cls, 'before_insert')
        def set_created_at(mapper, connection, target):
            if target.created_at is None:
                target.created_at = datetime.utcnow()
