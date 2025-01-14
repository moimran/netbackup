from datetime import datetime, timedelta
import uuid
import random
from databroker.app.models.base import engine, Base, SessionLocal
from databroker.app.models.models import (
    DeviceCredential,
    Site,
    Location,
    DeviceGroup,
    Device,
    DeviceType,
    DeviceStatus,
    BackupHistory,
    BackupStatus,
    User,
    Role
)
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create all tables
Base.metadata.create_all(bind=engine)

def create_mock_data():
    # Generate random IP
    def generate_ip():
        return f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
    
    # Generate random MAC
    def generate_mac():
        return ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])

    db = SessionLocal()
    try:
        # Check if we already have data
        if db.query(User).first():
            print("Database already initialized!")
            return

        # Create roles
        roles = [
            Role(id=str(uuid.uuid4()), name="admin", description="Administrator"),
            Role(id=str(uuid.uuid4()), name="operator", description="Operator"),
            Role(id=str(uuid.uuid4()), name="viewer", description="Viewer")
        ]
        db.add_all(roles)
        db.commit()

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
        db.add_all(users)
        db.commit()

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
        db.add_all(credentials)
        db.commit()

        # Create sites
        sites = [
            Site(
                id=str(uuid.uuid4()),
                name="New York DC",
                description="New York Data Center",
                address="123 Broadway, New York, NY",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Site(
                id=str(uuid.uuid4()),
                name="London DC",
                description="London Data Center",
                address="456 Oxford Street, London, UK",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Site(
                id=str(uuid.uuid4()),
                name="Tokyo DC",
                description="Tokyo Data Center",
                address="789 Shibuya, Tokyo, Japan",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]
        db.add_all(sites)
        db.commit()

        # Create locations for each site
        locations = []
        for site in sites:
            for floor in range(1, 4):
                locations.append(
                    Location(
                        id=str(uuid.uuid4()),
                        name=f"Floor {floor}",
                        description=f"Floor {floor} of {site.name}",
                        site_id=site.id,
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                )
        db.add_all(locations)
        db.commit()

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
        db.add_all(device_groups)
        db.commit()

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
                    description=f"{device_type.value} in {location.name}",
                    device_type=device_type,
                    ip_address=generate_ip(),
                    mac_address=generate_mac(),
                    model=f"Model-{random.randint(1000, 9999)}",
                    os_version=f"{random.randint(1, 9)}.{random.randint(0, 9)}.{random.randint(0, 9)}",
                    status=random.choice(statuses),
                    location_id=location.id,
                    credential_id=credential.id,
                    group_id=device_group.id,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
                devices.append(device)
        
        db.add_all(devices)
        db.commit()

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
                    config_data="mock config data" if status == BackupStatus.SUCCESS else None,
                    error_message="Backup failed due to connection timeout" if status == BackupStatus.FAILED else None,
                    created_at=created_at,
                    updated_at=created_at + timedelta(minutes=random.randint(1, 5))
                )
                backup_history.append(backup)
        
        db.add_all(backup_history)
        db.commit()

        print("Database initialized with mock data!")

    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_mock_data()
