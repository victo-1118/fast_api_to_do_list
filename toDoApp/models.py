from tortoise import fields
from tortoise.models import Model

class ListC(Model):
    id = fields.IntField(primary_key=True)
    name = fields.CharField(max_length=255, unique = True)
    
    items = fields.ReverseRelation["Item"]
    def __str__(self):
        return self.name
    class Meta:
        table = "listc"
        app = "models"
class Item(Model):
    id = fields.IntField(primary_key=True)
    text = fields.CharField(max_length=255)
    is_done = fields.BooleanField()
    list = fields.ForeignKeyField("models.ListC", related_name="items")
    def __str__(self):
        return self.text
    class Meta:
        table = "item"
        app = "models"
