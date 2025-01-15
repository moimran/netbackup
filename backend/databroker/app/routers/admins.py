from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import bcrypt
from ..database import get_db
from ..models.admin import Admin
from ..schemas.admin_schemas import AdminCreate, AdminUpdate, Admin as AdminSchema, AdminRole
from ..auth import get_password_hash, check_admin_permission, get_current_admin
import logging

router = APIRouter(prefix="/api/admins", tags=["admins"])
logger = logging.getLogger(__name__)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

@router.post("/", response_model=AdminSchema)
def create_admin(
    admin: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(lambda: check_admin_permission(min_role=AdminRole.SUPER_ADMIN.value))
):
    db_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if db_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(admin.password)
    db_admin = Admin(
        id=str(uuid.uuid4()),
        username=admin.username,
        email=admin.email,
        password=hashed_password,
        role=admin.role.value if hasattr(admin.role, 'value') else admin.role,
        status=admin.status.value if hasattr(admin.status, 'value') else admin.status
    )
    
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

@router.get("/", response_model=List[AdminSchema])
def get_admins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: Admin = Depends(lambda: check_admin_permission(min_role=AdminRole.READ_ONLY))
):
    try:
        from datetime import datetime
        admins = db.query(Admin).offset(skip).limit(limit).all()
        # Set default created_at for existing records
        for admin in admins:
            if admin.created_at is None:
                admin.created_at = datetime.utcnow()
        db.commit()
        return admins
    except Exception as e:
        logger.error(f"Error fetching admins: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching admins")

@router.get("/{admin_id}", response_model=AdminSchema)
def get_admin(
    admin_id: str,
    db: Session = Depends(get_db),
    _: Admin = Depends(lambda: check_admin_permission(min_role=AdminRole.READ_ONLY))
):
    try:
        admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin
    except Exception as e:
        logger.error(f"Error fetching admin: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching admin")

@router.put("/{admin_id}", response_model=AdminSchema)
def update_admin(
    admin_id: str,
    admin: AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(lambda: check_admin_permission(min_role=AdminRole.SUPER_ADMIN))
):
    try:
        db_admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if db_admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        update_data = admin.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])
        
        for key, value in update_data.items():
            setattr(db_admin, key, value)
        
        db.commit()
        db.refresh(db_admin)
        return db_admin
    except Exception as e:
        logger.error(f"Error updating admin: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating admin")

@router.delete("/{admin_id}")
def delete_admin(
    admin_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(lambda: check_admin_permission(min_role=AdminRole.SUPER_ADMIN))
):
    try:
        if admin_id == current_admin.id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
            
        db_admin = db.query(Admin).filter(Admin.id == admin_id).first()
        if db_admin is None:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        db.delete(db_admin)
        db.commit()
        return {"message": "Admin deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting admin: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting admin")
