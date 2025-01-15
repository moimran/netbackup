from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import (
    auth,
    devices,
    device_groups,
    sites,
    locations,
    device_credentials,
    dashboard,
    admins,
)
from .database import Base, engine
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NetBackup API",
    description="API for managing network device backups",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)  # Add auth router first
app.include_router(devices.router)
app.include_router(device_groups.router)
app.include_router(sites.router)
app.include_router(locations.router)
app.include_router(device_credentials.router)
app.include_router(dashboard.router)
app.include_router(admins.router)

@app.get("/")
async def root():
    return {"message": "NetBackup API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
