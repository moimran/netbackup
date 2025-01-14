from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from ..models.models import Device, BackupHistory
from ..auth import get_current_user
from ..schemas.dashboard_schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Get device statistics
    total_devices = db.query(func.count(Device.id)).scalar() or 0
    active_devices = db.query(func.count(Device.id)).filter(Device.status == "active").scalar() or 0
    inactive_devices = total_devices - active_devices

    # Get backup statistics for the last 24 hours
    last_24h = datetime.utcnow() - timedelta(hours=24)
    total_backups = db.query(func.count(BackupHistory.id))\
        .filter(BackupHistory.created_at >= last_24h).scalar() or 0
    successful_backups = db.query(func.count(BackupHistory.id))\
        .filter(BackupHistory.created_at >= last_24h)\
        .filter(BackupHistory.status == "success").scalar() or 0
    failed_backups = total_backups - successful_backups

    # Get recent activities
    recent_activities = db.query(BackupHistory)\
        .join(Device)\
        .order_by(BackupHistory.created_at.desc())\
        .limit(10)\
        .all()

    return {
        "total_devices": total_devices,
        "active_devices": active_devices,
        "inactive_devices": inactive_devices,
        "total_backups": total_backups,
        "successful_backups": successful_backups,
        "failed_backups": failed_backups,
        "recent_activities": [
            {
                "id": str(activity.id),
                "device_name": activity.device.name,
                "status": activity.status,
                "message": activity.message or "",  
                "created_at": activity.created_at.isoformat()
            }
            for activity in recent_activities
        ]
    }
