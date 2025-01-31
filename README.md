First indpendec RESTful api. To Do List API. 
Frontend is still in the works and its really basic right now and still not connected to backend

important stuff to know for poetry usage.

first: poetry install

How to run tests: poetry run test

How to run server: poetry run run-server

to add libraries/dependencies you would have to do: poetry add [name of libary]

to show what dependencies you have already added do: poetry show [dependency]

Frontend Timeline:
1/8/2025
Think of how I want to display items.
Ill have to think about the fact that ill have to make and recieve the calls to the database so first I 
should make dummy items
1/10/2025
Created the dummy items now all thats left is to make sure that the dummy items show their description
and whether are done or not. Thinking maybe ill show the descriptions after clicking on the item if I
decide to add a option for more in detail descriptions.
At least for mobile. maybe for on computer I show it to the side of the name of the task item to do
so that way I can use that extra space. In fact I could probably do something similar with the list display as I can show 
how many items out of total items are complete. Same thing can be done for mobile next to item name to show if its complete 
or not instead of showing it once clicking on the item.

I should probably add some more comments to my backend and frontend

thinking of just adding description currently just basic stuff and then I can add more design or features
1/11/2025 
just added the items descriptions after clicking them. think im going to focus on mobile first before adding computer query
 media stuff etc.
I think im almost ready to make the fetch api calls but first i got to fix the sidebar (back to list button dont make sense 
if your already at the list page and other similar issues)
Easier fix than i thought
Time for fetch api stuff. Ill probably start on the sidebar buttons functions then move to clicking
the lists
Ok so ive added some logic for the create list button and only issue is that there is some unwanted 
reloading as the fetch api request is happening so i've separeted the async function from the event 
listener since it allows me to look for the bug better and lets me verify if its at that point or not
Also added some Cors stuff and overall its not so bad as it does create a new list when using create
 list in my database and its just the bug thats the issue. The bug might also originate from live 
 server since it does refresh after changes in the code but it worked well last time when i didnt have
  the fetch api thing and was just showing the results in the frontend immediately.

1/13/2025
The issues was live server. what happend was that because live Server automatically looks for change in
 files in its directores to make sure those changes are shown in the website the page refreshed when the database was updated. Ive disabled liveserver from checking those database files.

1/14/2025 
Finished with the create item button. did have some issues but it wasnt major since it was just stupid/simple
mistakes like a capital letter or forgetting to add some stuff to the json im sending. I did realize
though that one of the features I added on click for item is pretty useless as my item model only
has the text and whether is_done or not. I plan later to change that so that I get rid of that whitespace
but right now im going to focus on finishing adding the crud functions.

Just realized im going to need another crud function. If i plan to make all the lists made before hand 
visible Im going to need to read all this list. This made me also think that read_list was basically 
useless at this point but im going to need to read the specific items from that list. read all list will
just load in those lists first.

Nevermind read_list doesnt show the items and although I could probably make it so that it does theres
no point since I have read_items. Ill keep it around though just in case I might need to use it later
for some reason

1/15/2025
Just finished the read items fetch request and works as expected. Found out that my read_item function
 doesnt have much use currently. I plan to now add the update function requests.

 Was planning to make it so that you have to hold click or touch to see options on whether to update
  or delete. Changed my mind though since that would be kind of weird in computer and also it would
  mess up with the box sizes for the li tags. Now im going to make sure that instead there is a drag
  left arrow to see options to update and delete for mobile. On computer/ non touch ill makes it so that if you hover over the item then you will see the option to delete or update. I think I will use the hold click or touch to drag elements

1/18/2025
I had an issue where under 391 pixels the lists container would not be seen completely. This was 
a problem since I was making a mobile first desing (starting from the lowest width given by 
chromes device it provided). To fix this I had to look at what was causing the width to overflow
Turns it that the margin-left: auto; style I used caused issues and made it so that the list min
size would be around 260 px. I fixed this by making sure that instead of using margin-left auto
to align things on the main axis of the flexbox that I would make sure everything i wanted right
to be in a container so i can use justify contet space between to move it all right. Also making 
sure that container had enough space for all the items was important as well. Fixing this bug also
made me realize that the minimum screen width I should be keeping an eye out for is 320 px
Just in case 320 px wasnt enough for the conten still I made it so that you could scroll horizontally
in the list. Now that ive added a place where the user can update or delete I will add those
functions in.

1/19/2025
Finished adding edit and delete function for the items just need to finish for the lists. Also cleaned up my code for 
eventlisteners using switch cases. By using data-action in my html it made this possible. Also added a test to check whether 
you could change just one aspect of my items model.


1/22/2025 
added the rest of the edit and delete functions along with media queries. Changed some of my crud functions to take an id 
instead of name of list and also changed how some routes worked becuase of that
I added a variable to determine the sidebar width to make it easier to change for media queries
Changed order where I linked style sheets since w3 style sheet was being annoying.
Fixed a bug where hamburger symbol wouldnt correctly display sidebar after more than 2 presses(it was an issue with type
 value although they both looked the same so they became ints to be fix them).
 Also read list and read item became useful since it was important to correctly display a specific item. Good thing i kept these in.
 Was going to finish this project here but I said before in the earlier entries I would add it so that you would see how 
 many are done.
 Got rid of some console messages and made it so that its clear if an item is complete or not by changing
 opacity and striking a line through the items name. Made it so that all completed items appear under
 all not completed items

Cool websites i found that were useful: 
caniuse.com
typescale.com



