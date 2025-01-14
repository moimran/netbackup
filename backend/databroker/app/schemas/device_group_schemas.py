from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DeviceGroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class DeviceGroupCreate(DeviceGroupBase):
    pass

class DeviceGroupUpdate(DeviceGroupBase):
    pass

class DeviceInGroup(BaseModel):
    id: str
    name: str
    ip_address: str
    type: str
    status: str

    class Config:
        from_attributes = True

class DeviceGroupResponse(DeviceGroupBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    devices: List[DeviceInGroup] = []

    class Config:
        from_attributes = True
