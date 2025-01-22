import os
import pytest
from fastapi import FastAPI
from main import app as app_to_return
from httpx import AsyncClient
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
os.environ["DATABASE_URL"] = "sqlite://:memory:"

# Assuming 'app' is imported from your main application
# from main import app

ClientManagerType = AsyncGenerator[AsyncClient, None]


@pytest.fixture(scope="module")
def anyio_backend() -> str:
    return "asyncio"

@asynccontextmanager
async def client_manager(app, base_url="http://test", **kwargs) -> ClientManagerType:
    os.environ["TESTING"] = "True"
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url=base_url, **kwargs) as client:
            yield client

@pytest.fixture(scope="function")
async def client(app: FastAPI) -> ClientManagerType:
    async with client_manager(app) as client:
        yield client

@pytest.fixture(scope="module")
def app() -> FastAPI:
    return app_to_return

class TestListsAPI:
    @pytest.mark.anyio
    async def test_client_type(self, client: AsyncClient) -> None:
        print(type(client))  # Should print <class 'httpx.AsyncClient'>
        assert isinstance(client, AsyncClient)

    @pytest.mark.anyio
    async def test_create_list(self, client: AsyncClient) -> None:
        print("Running test_create_list")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200
        assert response.json()["name"] == "Groceries"

    @pytest.mark.anyio
    async def test_read_list(self, client: AsyncClient) -> None:
        print("Running test_read_list")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200
        id = response.json()["id"]
        response = await client.get(f"/lists/{id}")
        print(response.json())
        assert response.status_code == 200
        assert response.json()["name"] == "Groceries"

    @pytest.mark.anyio
    async def test_update_list(self, client: AsyncClient) -> None:
        print("Running test_update_list")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200
        assert response.json()["name"] == "Groceries"

        response = await client.put("/lists/Groceries?new_name=Food")
        if response.status_code != 200:
            print(response.json())  # Print the error response for debugging
        assert response.status_code == 200
        assert response.json()["name"] == "Food"

    @pytest.mark.anyio
    async def test_delete_list(self, client: AsyncClient) -> None:
        print("Running test_delete_list")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200
        assert response.json()["name"] == "Groceries"
        id = response.json()["id"]
        response = await client.delete(f"/lists/{id}")
        assert response.status_code == 200

        response = await client.get(f"/lists/{id}")
        print(response.json())
        assert response.status_code == 404

    @pytest.mark.anyio
    async def test_create_item(self, client: AsyncClient) -> None:
        print("Running test_create_item")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200

        response = await client.post("/items/Groceries", json={"text": "test", "is_done": False})
        assert response.status_code == 200
        assert response.json()["text"] == "test"
        assert response.json()["is_done"] is False

    @pytest.mark.anyio
    async def test_read_item(self, client: AsyncClient) -> None:
        print("Running test_read_item")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200

        response = await client.post("/items/Groceries", json={"text": "test", "is_done": False})
        assert response.status_code == 200
        item_id = response.json()["id"]

        response = await client.get(f"/items/Groceries/{item_id}")
        assert response.status_code == 200
        assert response.json()["text"] == "test"
        assert response.json()["is_done"] is False
    @pytest.mark.anyio
    async def test_update_item(self, client: AsyncClient) -> None:
        print("Running test_update_item")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200

        response = await client.post("/items/Groceries", json={"text": "test", "is_done": False})
        assert response.status_code == 200
        assert response.json()["text"] == "test"
        assert response.json()["is_done"] is False
        item_id = response.json()["id"]

        response = await client.put(f"/items/Groceries/{item_id}?text=test2&is_done=true")
        if response.status_code != 200:
            print(response.json())  # Print the error response for debugging
        assert response.status_code == 200
        assert response.json()["text"] == "test2"
        assert response.json()["is_done"] is True

        response = await client.put(f"/items/Groceries/{item_id}?is_done=false")
        if response.status_code != 200:
            print(response.json())
        assert response.status_code == 200
        assert response.json()["text"] == "test2"
        assert response.json()["is_done"] is False

    @pytest.mark.anyio
    async def test_delete_item(self, client: AsyncClient) -> None:
        print("Running test_delete_item")
        response = await client.post("/lists/", json={"name": "Groceries"})
        assert response.status_code == 200

        response = await client.post("/items/Groceries", json={"text": "test", "is_done": False})
        assert response.status_code == 200
        item_id = response.json()["id"]

        response = await client.delete(f"/items/Groceries/{item_id}")
        assert response.status_code == 200
