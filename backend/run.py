import uvicorn
import os
import sys

# Get the absolute path of the current file's directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Add the parent directory to Python path
sys.path.append(current_dir)

from databroker.app.init_db import init_db

if __name__ == "__main__":
    # Initialize the database with mock data
    init_db()
    
    # Start the FastAPI server
    uvicorn.run(
        "databroker.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
