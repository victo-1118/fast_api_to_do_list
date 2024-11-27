import os
import logging
from fastapi import FastAPI
from toDoApp.routers import tasks
from tortoise import Tortoise, generate_config
from tortoise.contrib.fastapi import RegisterTortoise
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import uvicorn

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)
TESTING = os.getenv("TESTING", False)
# Function to generate Tortoise ORM config based on environment
def get_tortoise_config(db_url: str):
    return generate_config(
        db_url=db_url,
        app_modules={"models": ["toDoApp.models"]},
        testing=True,
        connection_label="models"
    )

# Lifespan context manager for testing environment
@asynccontextmanager
async def lifespan_test(app: FastAPI) -> AsyncGenerator[None, None]:
    config = get_tortoise_config("sqlite://:memory:") #Works in memory instead of a file
    async with RegisterTortoise(
        app=app,
        config=config,
        generate_schemas=True,
        add_exception_handlers=True,
    ):
        logger.debug("Tortoise ORM registered for testing.")
        yield
    logger.debug("Closing Tortoise ORM connections for testing...")
    await Tortoise._drop_databases()
    logger.debug("Tortoise ORM connections closed for testing.")

# Lifespan context manager for production environment
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    if os.getenv("TESTING") == "True":
        async with lifespan_test(app) as _:
            yield
    else:
        db_url = "sqlite://db.sqlite3"
        config = get_tortoise_config(db_url)
        async with RegisterTortoise(
            app=app,
            config=config,
            generate_schemas=True,
            add_exception_handlers=True,
        ):
            logger.debug("Tortoise ORM registered for production.")
            yield
        logger.debug("Tortoise ORM connections closed for production.")

# Initialize FastAPI app with the custom lifespan context manager
app = FastAPI(lifespan=lifespan)

# Include the router for task-related endpoints
app.include_router(tasks.router)
def run_server():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
if __name__ == "__main__":
    run_server()
# Define a root endpoint
@app.get("/")
async def root():
    return {"message": "to do app welcome :)"}

