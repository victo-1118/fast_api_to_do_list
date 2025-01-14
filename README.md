First indpendec RESTful api. To Do List API. Frontend is still in the works and its really basic right now and still not connected to backend
important stuff to know for poetry usage.
first: poetry install
How to run tests: poetry run test
How to run server: poetry run run-server
to add libraries/dependencies you would have to do: poetry add [name of libary]
to show what dependencies you have already added do: poetry show [dependency]
Frontend things I need to do:
1/8/2025
Think of how I want to display items.
Ill have to think about the fact that ill have to make and recieve the calls to the database so first I 
should make dummy items
1/10/2025
Created the dummy items now all thats left is to make sure that the dummy items show their description
and whether are done or not. Thinking maybe ill show the descriptions after clicking on the item if I
decide to add a option for more in detail descriptions.
At least for mobile. maybe for on computer I show it to the side of the name of the task item to do
so that way I can use that extra space. In fact I could probably do something similar with the list display as I can show how many items out of total items are complete. Same thing can be done for mobile next to item name to show if its complete or not instead of showing it once clicking on the item.

I should probably add some more comments to my backend and frontend

thinking of just adding description currently just basic stuff and then I can add more design or features
1/11/2025 
just added the items descriptions after clicking them. think im going to focus on mobile first before adding computer query media stuff etc.
I think im almost ready to make the fetch api calls but first i got to fix the sidebar (back to list button dont make sense if your already at the list page and other similar issues)
Easier fix than i thought
Time for fetch api stuff. Ill probably start on the sidebar buttons functions then move to clicking
the lists
Ok so ive added some logic for the create list button and only issue is that there is some unwanted reloading as the fetch api request is happening so i've separeted the async function from the event listener since it allows me to look for the bug better and lets me verify if its at that point or not
Also added some Cors stuff and overall its not so bad as it does create a new list when using create list in my database and its just the bug thats the issue. The bug might also originate from live server since it does refresh after changes in the code but it worked well last time when i didnt have the fetch api thing and was just showing the results in the frontend immediately.

1/13/2025
The issues was live server. what happend was that because live Server automatically looks for change in files in its directores to make sure those changes are shown in the website the page refreshed when the database was updated. Ive disabled liveserver from checking those database files.

1/14/2025 
Finished with the create item button. did have some issues but it wasnt major since it was just stupid/simple
mistakes like a capital letter or forgetting to add some stuff to the json im sending. I did realize
though that one of the features I added on click for item is pretty useless as my item model only
has the text and whether is_done or not. I plan later to change that so that I get rid of that whitespace
but right now im going to focus on finishing adding the crud functions.

