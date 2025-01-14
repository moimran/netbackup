from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from ..database import get_db
from ..models.models import Site as SiteModel
from ..schemas.schemas import Site, SiteCreate
import logging

router = APIRouter(prefix="/api/sites", tags=["sites"])
logger = logging.getLogger(__name__)

@router.post("/", response_model=Site)
def create_site(site: SiteCreate, db: Session = Depends(get_db)):
    try:
        db_site = SiteModel(
            id=str(uuid.uuid4()),
            **site.model_dump()
        )
        db.add(db_site)
        db.commit()
        db.refresh(db_site)
        return db_site
    except Exception as e:
        logger.error(f"Error creating site: {str(e)}")
        raise HTTPException(status_code=500, detail="Error creating site")

@router.get("/", response_model=List[Site])
def get_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        sites = db.query(SiteModel).offset(skip).limit(limit).all()
        return sites
    except Exception as e:
        logger.error(f"Error fetching sites: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching sites")

@router.get("/{site_id}", response_model=Site)
def get_site(site_id: str, db: Session = Depends(get_db)):
    try:
        site = db.query(SiteModel).filter(SiteModel.id == site_id).first()
        if site is None:
            raise HTTPException(status_code=404, detail="Site not found")
        return site
    except Exception as e:
        logger.error(f"Error fetching site: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching site")

@router.put("/{site_id}", response_model=Site)
def update_site(site_id: str, site: SiteCreate, db: Session = Depends(get_db)):
    try:
        db_site = db.query(SiteModel).filter(SiteModel.id == site_id).first()
        if db_site is None:
            raise HTTPException(status_code=404, detail="Site not found")
        
        for key, value in site.model_dump().items():
            setattr(db_site, key, value)
        
        db.commit()
        db.refresh(db_site)
        return db_site
    except Exception as e:
        logger.error(f"Error updating site: {str(e)}")
        raise HTTPException(status_code=500, detail="Error updating site")

@router.delete("/{site_id}")
def delete_site(site_id: str, db: Session = Depends(get_db)):
    try:
        db_site = db.query(SiteModel).filter(SiteModel.id == site_id).first()
        if db_site is None:
            raise HTTPException(status_code=404, detail="Site not found")
        
        db.delete(db_site)
        db.commit()
        return {"message": "Site deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting site: {str(e)}")
        raise HTTPException(status_code=500, detail="Error deleting site")
