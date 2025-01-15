from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid
from databroker.app.database import get_db
from databroker.app.models.models import DeviceGroup, Device, device_group_association
from databroker.app.schemas.device_group_schemas import (
    DeviceGroupCreate,
    DeviceGroupResponse,
    DeviceGroupUpdate,
)
from pydantic import BaseModel
import logging

router = APIRouter(prefix="/api/device-groups", tags=["device-groups"])
logger = logging.getLogger(__name__)

class DeviceIdRequest(BaseModel):
    device_id: str

@router.post("/", response_model=DeviceGroupResponse)
def create_device_group(group: DeviceGroupCreate, db: Session = Depends(get_db)):
    try:
        db_group = DeviceGroup(
            id=str(uuid.uuid4()),
            **group.model_dump()
        )
        db.add(db_group)
        db.commit()
        db.refresh(db_group)
        return db_group
    except Exception as e:
        logger.error(f"Error creating device group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating device group")

@router.get("/", response_model=List[DeviceGroupResponse])
def get_device_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        groups = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .offset(skip)
            .limit(limit)
            .all()
        )
        return groups
    except Exception as e:
        logger.error(f"Error fetching device groups: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching device groups")

@router.get("/{group_id}", response_model=DeviceGroupResponse)
def get_device_group(group_id: str, db: Session = Depends(get_db)):
    try:
        group = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .filter(DeviceGroup.id == group_id)
            .first()
        )
        if group is None:
            raise HTTPException(status_code=404, detail="Device group not found")
        return group
    except Exception as e:
        logger.error(f"Error fetching device group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching device group")

@router.put("/{group_id}", response_model=DeviceGroupResponse)
def update_device_group(group_id: str, group: DeviceGroupUpdate, db: Session = Depends(get_db)):
    try:
        db_group = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .filter(DeviceGroup.id == group_id)
            .first()
        )
        if db_group is None:
            raise HTTPException(status_code=404, detail="Device group not found")
        
        for key, value in group.model_dump().items():
            setattr(db_group, key, value)
        
        db.commit()
        db.refresh(db_group)
        return db_group
    except Exception as e:
        logger.error(f"Error updating device group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating device group")

@router.delete("/{group_id}")
def delete_device_group(group_id: str, db: Session = Depends(get_db)):
    try:
        db_group = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .filter(DeviceGroup.id == group_id)
            .first()
        )
        if db_group is None:
            raise HTTPException(status_code=404, detail="Device group not found")
        
        db.delete(db_group)
        db.commit()
        return {"message": "Device group deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting device group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting device group")

@router.post("/{group_id}/devices", response_model=DeviceGroupResponse)
def add_device_to_group(
    group_id: str, 
    request: DeviceIdRequest,
    db: Session = Depends(get_db)
):
    try:
        # Get the group
        group = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .filter(DeviceGroup.id == group_id)
            .first()
        )
        if group is None:
            raise HTTPException(status_code=404, detail="Device group not found")

        # Get the device
        device = db.query(Device).filter(Device.id == request.device_id).first()
        if device is None:
            raise HTTPException(status_code=404, detail="Device not found")

        # Add device to group if not already present
        if device not in group.devices:
            group.devices.append(device)
            db.commit()
            db.refresh(group)

        return group
    except Exception as e:
        logger.error(f"Error adding device to group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error adding device to group")

@router.delete("/{group_id}/devices/{device_id}")
def remove_device_from_group(group_id: str, device_id: str, db: Session = Depends(get_db)):
    try:
        # Get the group
        group = (
            db.query(DeviceGroup)
            .options(joinedload(DeviceGroup.devices))
            .filter(DeviceGroup.id == group_id)
            .first()
        )
        if group is None:
            raise HTTPException(status_code=404, detail="Device group not found")

        # Get the device
        device = db.query(Device).filter(Device.id == device_id).first()
        if device is None:
            raise HTTPException(status_code=404, detail="Device not found")

        # Remove device from group if present
        if device in group.devices:
            group.devices.remove(device)
            db.commit()
            db.refresh(group)

        return {"message": "Device removed from group successfully"}
    except Exception as e:
        logger.error(f"Error removing device from group: {str(e)}")
        raise HTTPException(status_code=500, detail="Error removing device from group")
