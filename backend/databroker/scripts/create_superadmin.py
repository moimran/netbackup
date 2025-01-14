import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.models import Admin
import bcrypt
import uuid
from datetime import datetime

def create_super_admin():
    db = SessionLocal()
    try:
        # Check if super admin already exists
        existing_admin = db.query(Admin).filter(Admin.username == "superadmin").first()
        if existing_admin:
            print("Super admin already exists!")
            return

        # Create password hash
        password = "admin123"  # You should change this in production
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Create super admin
        super_admin = Admin(
            id=str(uuid.uuid4()),
            username="superadmin",
            email="superadmin@netbackup.com",
            password=hashed_password.decode('utf-8'),  # Store as string
            role="super_admin",
            status="active",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(super_admin)
        db.commit()
        print("Super admin created successfully!")
        print("Username: superadmin")
        print("Password: admin123")

    except Exception as e:
        print(f"Error creating super admin: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_super_admin()
