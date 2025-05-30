from fastapi import FastAPI, Request
from starlette.middleware.sessions import SessionMiddleware
from loguru import logger

import sys

# from backend.core.config import settings
# from backend.api.reservation import router as reservation_router
# from backend.api.place import router as place_router
# from backend.api.fair import router as fair_router
# from backend.api.auth import router as auth_router

# Initialize FastAPI app
app = FastAPI()
# app.include_router(place_router, tags=["Place"])
# app.include_router(fair_router, tags=["Fair"])
# app.include_router(auth_router, tags=["Auth"])
# app.include_router(reservation_router, tags=["Reservation"])

# app.add_middleware(
#     SessionMiddleware, secret_key=settings.secret_key, same_site="lax", max_age=None
# )


# Configure Loguru
logger.remove()  # Remove default logger to configure custom settings
logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    level="INFO",
    enqueue=True,
    backtrace=True,
    diagnose=True,
)


@app.on_event("startup")
async def startup_event():
    """
    Code to run when the app starts.
    For example, database connection setup or loading configurations.
    """
    logger.info("Application startup: Initializing resources.")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Code to run when the app shuts down.
    For example, closing database connections or cleaning up.
    """
    logger.info("Application shutdown: Cleaning up resources.")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log HTTP requests and responses.
    """
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code} {request.url}")
    return response


# Example route
@app.get("/")
async def read_root():
    """
    Basic endpoint for testing.
    """
    logger.info("Root endpoint accessed.")
    return {"message": "Welcome to the FastAPI application!"}


# Additional route
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    logger.info("Health check endpoint accessed.")
    return {"status": "OK"}
