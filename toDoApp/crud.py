from .schemas import ListIn_Pydantic, ItemIn_Pydantic, List_Pydantic, Item_Pydantic
from .models import ListC, Item
from typing import TYPE_CHECKING, List
from fastapi import HTTPException
from tortoise.exceptions import DoesNotExist
if TYPE_CHECKING:
    class ListIn_Pydantic():
        pass
    class List_Pydantic():
        pass
    class ItemIn_Pydantic():
        pass
    class Item_Pydantic():
        pass




async def create_list(list_in: ListIn_Pydantic) -> List_Pydantic:
    
    list_data = list_in.dict(exclude_unset=True)
    items_data = list_data.pop("items", [])

    # Create the list object
    list_obj = await ListC.create(**list_data)
   
    # Create associated items if provided
    for item_data in items_data:
        await Item.create(**item_data, list=list_obj)
   
    # Return the created list object with items
    return await List_Pydantic.from_tortoise_orm(list_obj)


async def create_item(item_in: ItemIn_Pydantic, name: str) -> Item_Pydantic:
    list_obj = await ListC.filter(name=name).first()
    if not list_obj:
        raise HTTPException(status_code=404, detail="List to be used to create item not found")
    item_data = item_in.dict(exclude_unset=True)   
    item_data["list_id"] = list_obj.id
    item_obj = await Item.create(**item_data)
    return await ItemIn_Pydantic.from_tortoise_orm(item_obj)
async def read_list(list_id: int) -> List_Pydantic:
    list_obj = await ListC.filter(id=list_id).first()
    
    if not list_obj:
        raise HTTPException(status_code=404, detail=f"List with id = {list_id} to be read not found")
    return await List_Pydantic.from_tortoise_orm(list_obj)

async def read_all_lists() :
    return await List_Pydantic.from_queryset(ListC.all())

async def read_item(name: str, id: int) -> Item_Pydantic:
    try:
        list_obj = await ListC.filter(name=name).prefetch_related("items").first()
        if not list_obj:
            raise HTTPException(status_code=404, detail="List not found")
        
        item_obj = await Item.filter(id=id, list_id=list_obj.id).first()
        if not item_obj:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return await Item_Pydantic.from_tortoise_orm(item_obj)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="List or Item not found")
async def read_items(name: str) -> List:
    list_obj = await ListC.filter(name=name).first().prefetch_related("items")
    if not list_obj:
        return HTTPException(status_code=404, detail="List to be used to read items not found")
    items_in_list = []
    for item in list_obj.items:
        items_in_list.append({"id": item.id, "text": item.text, "is_done": item.is_done})
    return items_in_list

    
    
    
async def update_list(name:str, new_name: str) -> List_Pydantic:
    list_obj = await ListC.filter(name=name).first()
    if not list_obj:
        raise HTTPException(status_code=404, detail="List to be updated not found")
    list_obj.name = new_name
    await list_obj.save(update_fields=['name'])
    return await List_Pydantic.from_tortoise_orm(list_obj)
async def update_item(name:str,id : int, text: str = None, is_done: bool = None) -> Item_Pydantic:
    list_obj = await ListC.filter(name=name).first().prefetch_related("items")
    if not list_obj:
        return HTTPException(status_code=404, detail="List to be used to update item not found")
    item_obj = None
    item_obj = await Item.filter(id=id, list_id=list_obj.id).first()
    if item_obj == None:
        raise HTTPException(status_code=404, detail="Item to be updated not found")
    if text != None:
        item_obj.text = text
    if is_done != None:
        item_obj.is_done = is_done
    await item_obj.save()
    return await Item_Pydantic.from_tortoise_orm(item_obj)
async def delete_list(id: int):
    list_obj = await ListC.filter(id=id).first()
    if not list_obj:
        raise HTTPException(status_code=404, detail="List to be deleted not found")
    await list_obj.delete()
    return {"message" : f"List with id = {id} was succesfully deleted"}
async def delete_item(name:str, id: int):
    list_obj = await ListC.filter(name=name).first().prefetch_related("items")
    if not list_obj:
        return HTTPException(status_code=404, detail="List to be used to delete item not found")
    
    for item in list_obj.items:
        if (id == item.id):
            item_obj = item
    if not item_obj:
        raise HTTPException(status_code=404, detail="Item to be deleted not found")
    await item_obj.delete()
    return {"message" : f"item {id} has been succesfuly deleted"}
    
    
    
