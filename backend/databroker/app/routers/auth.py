from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..auth import authenticate_admin, create_access_token
from ..schemas.admin_schemas import Token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Login attempt for username: {form_data.username}")
    admin = authenticate_admin(form_data.username, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": admin.username, "role": admin.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": admin.username,
        "role": admin.role
    }

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}
