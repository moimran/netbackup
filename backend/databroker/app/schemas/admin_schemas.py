from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AdminRole(str):
    READ_ONLY = "read_only"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class AdminStatus(str):
    ACTIVE = "active"
    INACTIVE = "inactive"

class AdminBase(BaseModel):
    username: str
    role: str

class AdminCreate(AdminBase):
    password: str

class Admin(AdminBase):
    id: int
    status: str
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str

class TokenData(BaseModel):
    username: str
    role: Optional[str] = None
