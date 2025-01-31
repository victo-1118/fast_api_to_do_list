from fastapi import APIRouter, HTTPException
from toDoApp import crud, models, schemas
from typing import Optional, List
router = APIRouter()
@router.post("/lists/", response_model=schemas.ListWithProgress_Pydantic)
async def create_list(list_in: schemas.ListIn_Pydantic):
    try:
        return await crud.create_list(list_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/lists/{list_id}", response_model=schemas.ListWithProgress_Pydantic)
async def read_list(list_id: int):
    list_obj = await crud.read_list(list_id)
    if not list_obj:
        raise HTTPException(status_code=404, detail=f"List with id = {list_id} not found")
    return list_obj
@router.get("/lists/", response_model=List[schemas.ListWithProgress_Pydantic])
async def read_all_lists():
    return await crud.read_all_lists()

@router.put("/lists/{name}", response_model=schemas.List_Pydantic)
async def update_list(name: str, new_name: str):
    return await crud.update_list(name, new_name)
@router.delete("/lists/{id}")
async def delete_list(id: int):
    return await crud.delete_list(id)
@router.post("/items/{name}", response_model=schemas.Item_Pydantic)
async def create_item(item_in: schemas.ItemIn_Pydantic, name:str):
    return await crud.create_item(item_in, name)

@router.get("/items/{name}")
async def read_items(name: str):
    return await crud.read_items(name)
@router.get("/items/{name}/{item_id}", response_model=schemas.Item_Pydantic)
async def read_item(name: str, item_id: int):
    return await crud.read_item(name, item_id)
@router.put("/items/{name}/{item_id}", response_model=schemas.Item_Pydantic)
async def update_item(name: str, item_id: int, text:Optional[str]=None, is_done: Optional[bool]=None):
    return await crud.update_item(name, item_id, text, is_done)
@router.delete("/items/{name}/{item_id}")
async def delete_item(name: str, item_id: int):
    return await crud.delete_item(name, item_id)