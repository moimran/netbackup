from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, JSON, Enum as SQLEnum, func, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
import uuid
from ..database import Base

class DeviceType(str, enum.Enum):
    SWITCH = "Switch"
    ROUTER = "Router"
    FIREWALL = "Firewall"

class DeviceStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"
    MAINTENANCE = "maintenance"

class BackupStatus(str, enum.Enum):
    SUCCESS = "success"
    FAILED = "failed"
    IN_PROGRESS = "in_progress"
    PENDING = "pending"

# Association table for Device-DeviceGroup many-to-many relationship
device_group_association = Table(
    'device_group_association',
    Base.metadata,
    Column('device_id', String, ForeignKey('devices.id'), primary_key=True),
    Column('group_id', String, ForeignKey('device_groups.id'), primary_key=True)
)

class DeviceCredential(Base):
    __tablename__ = "device_credentials"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    enable_password = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DeviceCredentials(Base):
    __tablename__ = "device_credentials_2"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, ForeignKey("devices.id"), unique=True, nullable=True)
    name = Column(String, nullable=False)
    username = Column(String)
    password = Column(String)
    ssh_key = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    device = relationship("Device", back_populates="credentials")

class Site(Base):
    __tablename__ = "sites"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    description = Column(String)
    address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    locations = relationship("Location", back_populates="site")

class Location(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    site_id = Column(String, ForeignKey("sites.id"), nullable=False)
    floor = Column(String)
    room = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    site = relationship("Site", back_populates="locations")

class DeviceGroup(Base):
    __tablename__ = "device_groups"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    devices = relationship("Device", secondary=device_group_association, back_populates="groups")

class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    ip_address = Column(String, nullable=False)
    type = Column(SQLEnum(DeviceType), nullable=False)
    status = Column(SQLEnum(DeviceStatus), default=DeviceStatus.INACTIVE)
    site_id = Column(String, ForeignKey("sites.id"))
    location_id = Column(String, ForeignKey("locations.id"))
    credential_id = Column(String, ForeignKey("device_credentials.id"))
    last_backup = Column(DateTime)
    next_backup = Column(DateTime)
    config = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    site = relationship("Site")
    location = relationship("Location")
    credential = relationship("DeviceCredential")
    groups = relationship("DeviceGroup", secondary=device_group_association, back_populates="devices")
    backup_history = relationship("BackupHistory", back_populates="device", cascade="all, delete-orphan")
    credentials = relationship("DeviceCredentials", back_populates="device", uselist=False)

class BackupHistory(Base):
    __tablename__ = "backup_history"

    id = Column(String, primary_key=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=False)
    status = Column(SQLEnum(BackupStatus), nullable=False)
    message = Column(String)
    config_file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    device = relationship("Device", back_populates="backup_history")

class Role(Base):
    __tablename__ = "roles"

    id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    users = relationship("User", back_populates="role")

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role_id = Column(String, ForeignKey("roles.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    role = relationship("Role", back_populates="users")
