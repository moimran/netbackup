from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from ..database import get_db
from ..models.models import Device as DeviceModel, DeviceGroup as DeviceGroupModel
from ..schemas.schemas import Device, DeviceCreate, DeviceUpdate
import logging

router = APIRouter(prefix="/api/devices", tags=["devices"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=Device)
def create_device(device: DeviceCreate, db: Session = Depends(get_db)):
    try:
        device_data = device.model_dump(exclude={'group_ids'})
        db_device = DeviceModel(
            id=str(uuid.uuid4()),
            **device_data
        )

        if device.group_ids:
            groups = db.query(DeviceGroupModel).filter(DeviceGroupModel.id.in_(device.group_ids)).all()
            db_device.groups = groups

        db.add(db_device)
        db.commit()
        db.refresh(db_device)
        return db_device
    except Exception as e:
        logger.error(f"Error creating device: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating device")

@router.get("/", response_model=List[Device])
def get_devices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        devices = db.query(DeviceModel).offset(skip).limit(limit).all()
        return devices
    except Exception as e:
        logger.error(f"Error fetching devices: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching devices")

@router.get("/{device_id}", response_model=Device)
def get_device(device_id: str, db: Session = Depends(get_db)):
    try:
        device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
        if device is None:
            raise HTTPException(status_code=404, detail="Device not found")
        return device
    except Exception as e:
        logger.error(f"Error fetching device: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching device")

@router.put("/{device_id}", response_model=Device)
def update_device(device_id: str, device: DeviceUpdate, db: Session = Depends(get_db)):
    try:
        db_device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
        if db_device is None:
            raise HTTPException(status_code=404, detail="Device not found")
        
        update_data = device.model_dump(exclude_unset=True, exclude={'group_ids'})
        for key, value in update_data.items():
            setattr(db_device, key, value)

        if device.group_ids is not None:
            groups = db.query(DeviceGroupModel).filter(DeviceGroupModel.id.in_(device.group_ids)).all()
            db_device.groups = groups
        
        db.commit()
        db.refresh(db_device)
        return db_device
    except Exception as e:
        logger.error(f"Error updating device: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating device")

@router.delete("/{device_id}")
def delete_device(device_id: str, db: Session = Depends(get_db)):
    try:
        db_device = db.query(DeviceModel).filter(DeviceModel.id == device_id).first()
        if db_device is None:
            raise HTTPException(status_code=404, detail="Device not found")
        
        db.delete(db_device)
        db.commit()
        return {"message": "Device deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting device: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting device")
