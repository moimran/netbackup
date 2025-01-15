from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.models import DeviceCredentials, Device
from ..schemas.device_credentials_schemas import (
    DeviceCredentials as DeviceCredentialsSchema,
    DeviceCredentialsCreate,
    DeviceCredentialsUpdate,
)
from ..auth import get_current_user
import logging

router = APIRouter(prefix="/api/device-credentials", tags=["device_credentials"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=DeviceCredentialsSchema)
async def create_device_credentials(
    credentials: DeviceCredentialsCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Only check device if device_id is provided
    if credentials.device_id:
        # Check if device exists
        device = db.query(Device).filter(Device.id == credentials.device_id).first()
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found"
            )

        # Check if credentials already exist for this device
        existing_credentials = db.query(DeviceCredentials).filter(
            DeviceCredentials.device_id == credentials.device_id
        ).first()
        if existing_credentials:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Credentials already exist for this device"
            )

    db_credentials = DeviceCredentials(**credentials.dict())
    db.add(db_credentials)
    db.commit()
    db.refresh(db_credentials)
    return db_credentials

@router.get("/", response_model=List[DeviceCredentialsSchema])
async def get_all_device_credentials(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    credentials = db.query(DeviceCredentials).all()
    return credentials

@router.get("/{device_id}", response_model=DeviceCredentialsSchema)
async def get_device_credentials(
    device_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    credentials = db.query(DeviceCredentials).filter(
        DeviceCredentials.device_id == device_id
    ).first()
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credentials not found"
        )
    return credentials

@router.put("/{device_id}", response_model=DeviceCredentialsSchema)
async def update_device_credentials(
    device_id: str,
    credentials: DeviceCredentialsUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_credentials = db.query(DeviceCredentials).filter(
        DeviceCredentials.device_id == device_id
    ).first()
    if not db_credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credentials not found"
        )

    for field, value in credentials.dict(exclude_unset=True).items():
        setattr(db_credentials, field, value)

    db.commit()
    db.refresh(db_credentials)
    return db_credentials

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device_credentials(
    device_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    credentials = db.query(DeviceCredentials).filter(
        DeviceCredentials.device_id == device_id
    ).first()
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Credentials not found"
        )

    db.delete(credentials)
    db.commit()
    return {"message": "Credentials deleted successfully"}
