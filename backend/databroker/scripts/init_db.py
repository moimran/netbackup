import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models.models import (
    Base, 
    User,
    Device, 
    Site, 
    Location, 
    DeviceGroup, 
    DeviceCredential, 
    BackupHistory,
    Role,
    DeviceType,
    DeviceStatus,
    BackupStatus,
    DeviceCredentials
)
from datetime import datetime, timedelta
import uuid
import random
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    # Generate random IP
    def generate_ip():
        return f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
    
    # Generate random MAC
    def generate_mac():
        return ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])

    print("Creating database tables...")
    try:
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        # Create tables
        Base.metadata.create_all(bind=engine)
        
        # Create session
        db = SessionLocal()
        
        try:
            # Create roles
            roles = [
                Role(id=str(uuid.uuid4()), name="admin", description="Administrator"),
                Role(id=str(uuid.uuid4()), name="operator", description="Operator"),
                Role(id=str(uuid.uuid4()), name="viewer", description="Viewer")
            ]
            
            # Create users
            users = [
                User(
                    id=str(uuid.uuid4()),
                    username="admin",
                    email="admin@example.com",
                    hashed_password=pwd_context.hash("admin123"),
                    role_id=roles[0].id,
                    is_active=True
                ),
                User(
                    id=str(uuid.uuid4()),
                    username="operator",
                    email="operator@example.com",
                    hashed_password=pwd_context.hash("operator123"),
                    role_id=roles[1].id,
                    is_active=True
                ),
                User(
                    id=str(uuid.uuid4()),
                    username="viewer",
                    email="viewer@example.com",
                    hashed_password=pwd_context.hash("viewer123"),
                    role_id=roles[2].id,
                    is_active=True
                )
            ]

            # Create device credentials
            credentials = [
                DeviceCredential(
                    id=str(uuid.uuid4()),
                    name="Cisco Switch Credentials",
                    username="admin",
                    password="cisco123",
                    enable_password="enable123",
                    description="Default credentials for Cisco switches",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                DeviceCredential(
                    id=str(uuid.uuid4()),
                    name="Juniper Router Credentials",
                    username="juniper_admin",
                    password="juniper123",
                    description="Default credentials for Juniper routers",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                DeviceCredential(
                    id=str(uuid.uuid4()),
                    name="Firewall Admin",
                    username="firewall_admin",
                    password="firewall123",
                    description="Credentials for firewall devices",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            ]

            # Create sites
            sites = [
                Site(
                    id=str(uuid.uuid4()),
                    name="New York DC",
                    code="NYC",
                    description="New York Data Center",
                    address="123 Broadway, New York, NY",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Site(
                    id=str(uuid.uuid4()),
                    name="London DC",
                    code="LDN",
                    description="London Data Center",
                    address="456 Oxford Street, London, UK",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                Site(
                    id=str(uuid.uuid4()),
                    name="Tokyo DC",
                    code="TKY",
                    description="Tokyo Data Center",
                    address="789 Shibuya, Tokyo, Japan",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            ]

            # Create locations for each site
            locations = []
            for site in sites:
                for floor in range(1, 4):
                    locations.append(
                        Location(
                            id=str(uuid.uuid4()),
                            name=f"Floor {floor}",
                            floor=f"{floor}",
                            room=f"Room {floor}01",
                            site_id=site.id,
                            created_at=datetime.utcnow(),
                            updated_at=datetime.utcnow()
                        )
                    )

            # Create device groups
            device_groups = [
                DeviceGroup(
                    id=str(uuid.uuid4()),
                    name="Core Network",
                    description="Core network devices",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                DeviceGroup(
                    id=str(uuid.uuid4()),
                    name="Access Layer",
                    description="Access layer switches",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                ),
                DeviceGroup(
                    id=str(uuid.uuid4()),
                    name="Security Devices",
                    description="Firewalls and security appliances",
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            ]

            # Create devices
            devices = []
            device_types = [DeviceType.ROUTER, DeviceType.SWITCH, DeviceType.FIREWALL]
            statuses = [DeviceStatus.ACTIVE, DeviceStatus.INACTIVE, DeviceStatus.MAINTENANCE]
            
            for location in locations:
                for _ in range(3):  # 3 devices per location
                    device_type = random.choice(device_types)
                    credential = random.choice(credentials)
                    device_group = random.choice(device_groups)
                    
                    device = Device(
                        id=str(uuid.uuid4()),
                        name=f"{device_type.value}-{generate_mac()[:8]}",
                        ip_address=generate_ip(),
                        type=device_type,
                        status=random.choice(statuses),
                        location_id=location.id,
                        credential_id=credential.id,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    device.groups.append(device_group)
                    devices.append(device)

                    # Create device-specific credentials
                    device_credentials = DeviceCredentials(
                        id=str(uuid.uuid4()),
                        device_id=device.id,
                        name=f"{device.name} - {credential.name}",
                        username=credential.username,
                        password=credential.password,
                        ssh_key=None,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    db.add(device_credentials)

            # Create backup history
            backup_history = []
            for device in devices:
                # Create multiple backup entries for each device
                for _ in range(random.randint(3, 7)):
                    status = random.choice([BackupStatus.SUCCESS, BackupStatus.FAILED, BackupStatus.IN_PROGRESS])
                    created_at = datetime.utcnow() - timedelta(days=random.randint(1, 30))
                    
                    backup = BackupHistory(
                        id=str(uuid.uuid4()),
                        device_id=device.id,
                        status=status,
                        config_file_path="/backups/config.txt" if status == BackupStatus.SUCCESS else None,
                        message="Backup failed due to connection timeout" if status == BackupStatus.FAILED else None,
                        created_at=created_at,
                        updated_at=created_at + timedelta(minutes=random.randint(1, 5))
                    )
                    backup_history.append(backup)

            # Add all objects to database
            db.add_all(roles)
            db.add_all(users)
            db.add_all(credentials)
            db.add_all(sites)
            db.add_all(locations)
            db.add_all(device_groups)
            db.add_all(devices)
            db.add_all(backup_history)
            db.commit()
            print("Database initialized with mock data!")
        except Exception as e:
            db.rollback()
            print(f"Error adding mock data: {e}")
            raise
        finally:
            db.close()

    except Exception as e:
        print(f"Error initializing database: {e}")
        raise

if __name__ == "__main__":
    init_db()
