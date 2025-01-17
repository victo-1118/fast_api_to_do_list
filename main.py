import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    """
    Generates Tortoise ORM configuration based on environment.

    Args:
        db_url (str): The URL of the database to use.

    Returns:
        dict: The generated configuration.

    """
    return generate_config(
        db_url=db_url,
        app_modules={"models": ["toDoApp.models"]},
        testing=True,
        connection_label="models"
    )

# Lifespan context manager for testing environment

@asynccontextmanager
async def lifespan_test(app: FastAPI) -> AsyncGenerator[None, None]:    
    """
    Lifespan context manager to configure Tortoise ORM for testing environment.
    When this context manager is used, Tortoise is configured to use an in-memory
    database, and schemas are generated. This context manager is used instead of
    the default lifespan context manager when the environment variable 'TESTING'
    is set to 'True'.
    """
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

    """
    Lifespan context manager to configure Tortoise ORM for either testing or production
    environment. If the environment variable 'TESTING' is set to 'True', Tortoise is
    configured to use an in-memory database. Otherwise, it is configured to use a SQLite
    database file at 'db.sqlite3'.
    In this case the context manager is not used by us but used by FastAPI
    When you create a context manager or an async context manager like above, what it does is that,
      before entering the with block, it will execute the code before the yield,
      and after exiting the with block, it will execute the code after the yield.
    """
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

# Configure CORS Middleware
origins = [
    "http://127.0.0.1:5500",  # Frontend URL (adjust as needed)
    "http://localhost:3000",  # Alternative localhost URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Domains allowed to access your API
    allow_credentials=True,  # Allow cookies or authentication headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

# Include the router for task-related endpoints
app.include_router(tasks.router)
def run_server():
    """
    Run the FastAPI application using uvicorn.

    This function is intended to be used as an entry point for the application
    when running directly from the command line. When the application is run
    using poetry, the command should be "poetry run run-server".

    :param: None
    :return: None
    """
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
if __name__ == "__main__":
    run_server()
# Define a root endpoint
@app.get("/")
async def root():
    return {"message": "to do app welcome :)"}

#important stuff to know for poetry usage.
# first: poetry install
#How to run tests: poetry run test
# How to run server: poetry run run-server
# to add libraries/dependencies you would have to do poetry add [name of libary]