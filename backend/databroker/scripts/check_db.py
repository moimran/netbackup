import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.models import Admin

def check_database():
    db = SessionLocal()
    try:
        print("\nChecking Admin table:")
        admins = db.query(Admin).all()
        if not admins:
            print("No admins found in the database!")
        else:
            for admin in admins:
                print(f"\nAdmin details:")
                print(f"ID: {admin.id}")
                print(f"Username: {admin.username}")
                print(f"Email: {admin.email}")
                print(f"Role: {admin.role}")
                print(f"Status: {admin.status}")
                print(f"Password hash: {admin.password[:20]}...")  # Only show part of the hash

    except Exception as e:
        print(f"Error checking database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    check_database()
