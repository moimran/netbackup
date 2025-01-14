from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RecentActivity(BaseModel):
    id: str
    device_name: str
    status: str
    message: Optional[str] = None
    created_at: str

class DashboardStats(BaseModel):
    total_devices: int
    active_devices: int
    inactive_devices: int
    total_backups: int
    successful_backups: int
    failed_backups: int
    recent_activities: List[RecentActivity]
