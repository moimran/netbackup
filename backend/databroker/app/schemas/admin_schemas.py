from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class AdminRole(str, Enum):
    READ_ONLY = "read_only"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class AdminStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class AdminBase(BaseModel):
    username: str
    email: EmailStr
    role: AdminRole = AdminRole.ADMIN
    status: AdminStatus = AdminStatus.ACTIVE

class AdminCreate(AdminBase):
    password: str

class AdminUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[AdminRole] = None
    status: Optional[AdminStatus] = None

class Admin(AdminBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

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
