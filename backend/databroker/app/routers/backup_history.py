from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.models import BackupHistory
import logging

router = APIRouter(prefix="/api/backup-history", tags=["backup-history"])
logger = logging.getLogger(__name__)

@router.get("/")
async def get_backup_history(db: Session = Depends(get_db)):
    try:
        history = db.query(BackupHistory).all()
        return history
    except Exception as e:
        logger.error(f"Error getting backup history: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching backup history")
