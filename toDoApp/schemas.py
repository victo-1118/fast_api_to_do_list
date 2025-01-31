from tortoise.contrib.pydantic import pydantic_model_creator
from toDoApp.models import ListC, Item
from typing import Optional, List as ListType, TYPE_CHECKING

List_Pydantic = pydantic_model_creator(ListC, name="list")
ListIn_PydanticBase = pydantic_model_creator(ListC, name="list", exclude_readonly=True)
Item_Pydantic = pydantic_model_creator(Item, name="item")
ItemIn_Pydantic = pydantic_model_creator(Item, name="item", exclude_readonly=True)

if TYPE_CHECKING:
    
    class List_Pydantic():
        pass

class ListWithProgress_Pydantic(List_Pydantic):
    total_items: Optional[int] = 0
    completed_items: Optional[int] = 0
    class Config:
        from_attributes = True
class ListIn_Pydantic(ListIn_PydanticBase):
    items: Optional[ListType[ItemIn_Pydantic]] = None
    id: Optional[int] = None
class ItemIn_Pydantic(ItemIn_Pydantic):
    id: Optional[int] = None
    list: Optional[List_Pydantic] = None