from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeviceCredentialsBase(BaseModel):
    username: str
    password: str
    name: str
    ssh_key: Optional[str] = None

class DeviceCredentialsCreate(DeviceCredentialsBase):
    device_id: str

class DeviceCredentialsUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None
    ssh_key: Optional[str] = None

class DeviceCredentials(DeviceCredentialsBase):
    id: str
    device_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
