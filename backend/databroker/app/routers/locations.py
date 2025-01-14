from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import uuid
from ..database import get_db
from ..models.models import Location as LocationModel
from ..schemas.schemas import Location, LocationCreate
import logging

router = APIRouter(prefix="/api/locations", tags=["locations"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=Location)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    try:
        db_location = LocationModel(
            id=str(uuid.uuid4()),
            **location.model_dump()
        )
        db.add(db_location)
        db.commit()
        db.refresh(db_location)
        return db_location
    except Exception as e:
        logger.error(f"Error creating location: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating location")

@router.get("/", response_model=List[Location])
def get_locations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        locations = db.query(LocationModel).options(joinedload(LocationModel.site)).offset(skip).limit(limit).all()
        return locations
    except Exception as e:
        logger.error(f"Error fetching locations: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching locations")

@router.get("/site/{site_id}", response_model=List[Location])
def get_locations_by_site(site_id: str, db: Session = Depends(get_db)):
    try:
        locations = db.query(LocationModel).options(joinedload(LocationModel.site)).filter(LocationModel.site_id == site_id).all()
        return locations
    except Exception as e:
        logger.error(f"Error fetching locations by site: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching locations by site")

@router.get("/{location_id}", response_model=Location)
def get_location(location_id: str, db: Session = Depends(get_db)):
    try:
        location = db.query(LocationModel).options(joinedload(LocationModel.site)).filter(LocationModel.id == location_id).first()
        if location is None:
            raise HTTPException(status_code=404, detail="Location not found")
        return location
    except Exception as e:
        logger.error(f"Error fetching location: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching location")

@router.put("/{location_id}", response_model=Location)
def update_location(location_id: str, location: LocationCreate, db: Session = Depends(get_db)):
    try:
        db_location = db.query(LocationModel).filter(LocationModel.id == location_id).first()
        if db_location is None:
            raise HTTPException(status_code=404, detail="Location not found")

        for key, value in location.model_dump().items():
            setattr(db_location, key, value)

        db.commit()
        db.refresh(db_location)
        return db_location
    except Exception as e:
        logger.error(f"Error updating location: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating location")

@router.delete("/{location_id}")
def delete_location(location_id: str, db: Session = Depends(get_db)):
    try:
        db_location = db.query(LocationModel).filter(LocationModel.id == location_id).first()
        if db_location is None:
            raise HTTPException(status_code=404, detail="Location not found")
        
        db.delete(db_location)
        db.commit()
        return {"message": "Location deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting location: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting location")
