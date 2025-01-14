from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DeviceType(str, Enum):
    SWITCH = "Switch"
    ROUTER = "Router"
    FIREWALL = "Firewall"

class DeviceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    MAINTENANCE = "maintenance"

# Base Models
class BaseModelWithTimestamp(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Device Credential Schemas
class DeviceCredentialBase(BaseModel):
    name: str
    username: str
    description: Optional[str] = None

class DeviceCredentialCreate(DeviceCredentialBase):
    password: str
    enable_password: Optional[str] = None

class DeviceCredential(DeviceCredentialBase, BaseModelWithTimestamp):
    id: str

# Site Schemas
class SiteBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    address: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class Site(SiteBase):
    id: str

    class Config:
        from_attributes = True

# Location Schemas
class LocationBase(BaseModel):
    name: str
    site_id: str
    floor: Optional[str] = None
    room: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    id: str
    site: Optional[Site] = None

    class Config:
        from_attributes = True

# Simplified Device Schema (without groups)
class DeviceInGroup(BaseModel):
    id: str
    name: str
    ip_address: str
    type: DeviceType
    status: DeviceStatus

    class Config:
        from_attributes = True

# Device Group Schemas
class DeviceGroupBase(BaseModel):
    name: str
    description: Optional[str] = None

class DeviceGroupCreate(DeviceGroupBase):
    pass

class DeviceGroup(DeviceGroupBase):
    id: str
    devices: List[DeviceInGroup] = []

    class Config:
        from_attributes = True

# Simplified Group Schema (without devices)
class DeviceGroupInDevice(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Full Device Schema
class DeviceBase(BaseModel):
    name: str
    ip_address: str
    type: DeviceType
    site_id: Optional[str] = None
    location_id: Optional[str] = None
    credential_id: Optional[str] = None
    config: Optional[dict] = None

class DeviceCreate(DeviceBase):
    group_ids: Optional[List[str]] = None

class DeviceUpdate(DeviceBase):
    status: Optional[DeviceStatus] = None
    group_ids: Optional[List[str]] = None

class Device(DeviceBase, BaseModelWithTimestamp):
    id: str
    status: DeviceStatus = DeviceStatus.INACTIVE
    last_backup: Optional[datetime] = None
    next_backup: Optional[datetime] = None
    site: Optional[Site] = None
    location: Optional[Location] = None
    credential: Optional[DeviceCredential] = None
    groups: List[DeviceGroupInDevice] = []

    class Config:
        from_attributes = True
