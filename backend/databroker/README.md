# NetBackup API

A FastAPI-based REST API for managing network device backups.

## Features

- Device management
- Device credentials management
- Site and location management
- Device grouping
- SQLite database (can be switched to PostgreSQL)
- OpenAPI documentation
- Logging system

## Prerequisites

- Python 3.8+
- pip

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the application using uvicorn:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the application is running, you can access:
- OpenAPI documentation: http://localhost:8000/docs
- Alternative documentation: http://localhost:8000/redoc

## API Endpoints

### Device Credentials
- GET /api/device-credentials/
- POST /api/device-credentials/
- GET /api/device-credentials/{credential_id}
- PUT /api/device-credentials/{credential_id}
- DELETE /api/device-credentials/{credential_id}

### Sites
- GET /api/sites/
- POST /api/sites/
- GET /api/sites/{site_id}
- PUT /api/sites/{site_id}
- DELETE /api/sites/{site_id}

### Locations
- GET /api/locations/
- POST /api/locations/
- GET /api/locations/site/{site_id}
- GET /api/locations/{location_id}
- PUT /api/locations/{location_id}
- DELETE /api/locations/{location_id}

### Device Groups
- GET /api/device-groups/
- POST /api/device-groups/
- GET /api/device-groups/{group_id}
- PUT /api/device-groups/{group_id}
- DELETE /api/device-groups/{group_id}

### Devices
- GET /api/devices/
- POST /api/devices/
- GET /api/devices/{device_id}
- PUT /api/devices/{device_id}
- DELETE /api/devices/{device_id}

## Database

The application uses SQLite by default. The database file will be created as `netbackup.db` in the root directory. To switch to PostgreSQL:

1. Update the database URL in `app/models/base.py`
2. Install psycopg2: `pip install psycopg2-binary`
3. Update the connection parameters as needed
