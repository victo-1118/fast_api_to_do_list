
function loadSideBar (){
    const sidebarHTML = `
    <div class="hamburger-menu" id="hamburger">
        &#9776; <!-- This is the hamburger icon (three horizontal lines) -->
    </div>
    <nav class="sidebar" id="sidebar">
        <ul class="sidebar-list">
            <li class="sidebar-item">
                <div class="circle plus"></div>
                <p> Create List </p>
            </li>
            <li class="sidebar-item">
                <div class="container-fa"><i class="fa fa-search"></i></div>
                <p> Search </p>    
            </li>
            <li class="sidebar-item" id = "back-to-lists">
                <div class="gg-arrow-left-o"></div>
                <p> Back to Lists</p>
        </ul>
    </nav>`
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}
loadSideBar();
async function loadLists() {
    try {
        const response = await fetch("http://127.0.0.1:8000/lists/");
        if (!response.ok) {
            throw new Error(`Http error, Status${response.status}`)
        }
        const allListsData = await response.json()
        console.log(allListsData)
        allListsData.forEach(list => {
            console.log(list)
            const listHtml = `
            <li class="list" data-action = "display-items" data-id="${list.id}" data-name="${list.name}">
                <p class="list-name">${list.name}</p>
                <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
                <div class="button-wrapper" style="display: none;">
                    <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                    <p class="edit-button" data-action="edit-list">&#9998;</p>
                    <p class="delete-button" data-action="delete-list">&#128465;</p>
                </div>
            </li>
            `
            listsContainer.insertAdjacentHTML('beforeend', listHtml);


        })
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
loadLists();
const listsPage = document.getElementById('lists-page');
listsPage.style.display = `block`;
const itemsPage = document.getElementById("items-page")
itemsPage.style.display = `none`;
const listsContainer = document.querySelector(".lists")
let itemsContainer = null
let listName = null;
const createButton = document.querySelector(".sidebar-item:nth-child(1)");
const searchButton = document.querySelector(".sidebar-item:nth-child(2)");
const backButton = document.getElementById('back-to-lists');
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");


function displaySidebar() {
    const sidebarWidth = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width').trim();
    // Convert sidebarWidth to a number for comparison
    const sidebarWidthValue = parseInt(sidebarWidth, 10);
    const sidebarLeftValue = parseInt(sidebar.style.left, 10);

    // Determine if the sidebar is hidden
    const sidebarHidden = isNaN(sidebarLeftValue) || sidebarLeftValue === -sidebarWidthValue;

    if (sidebarHidden) {
        sidebar.style.left = `0`;
        console.log(`Sidebar width: ${sidebarWidth}`);
        console.log(`Sidebar left: ${sidebar.style.left}`);
        console.log(`Sidebar hidden: ${sidebarHidden}`);
        
        listsPage.style.marginLeft = `${sidebarWidth}`;
        itemsPage.style.marginLeft = `${sidebarWidth}`;
        listsPage.style.width = `calc(100% - ${sidebarWidth})`;
        itemsPage.style.width = `calc(100% - ${sidebarWidth})`;
    } else {
        console.log(`Sidebar width: ${sidebarWidth}`);
        console.log(`Sidebar left: ${sidebar.style.left}`);
        console.log(`Sidebar hidden: ${sidebarHidden}`);
        
        sidebar.style.left = `-${sidebarWidth}`;
        listsPage.style.marginLeft = `0px`;
        itemsPage.style.marginLeft = `0px`;
        listsPage.style.width = `100%`;
        itemsPage.style.width = `100%`;
    }
}

    
function scrollToSearchedList (listName) {
    const listElement = document.querySelector(`.list[data-name="${listName}"]`);
    listElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function scrollToSearchedItem (itemName) {
    const itemElement = document.querySelector(`.item[data-name="${itemName}"]`);
    itemElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function displayListsPage () {
    itemsPage.style.display = `none`
    listsPage.style.display = `block`
    backButton.style.display = `none`
    createButton.querySelector("p").textContent = "Create List"
}
function displayItemsPage (listId, listName) {
    createButton.querySelector("p").textContent = "Create Item"
    backButton.style.display = `block`
    console.log(`Loading items for List ID: ${listId}, List Name: ${listName}`);
    listsPage.style.display = `none`;
    itemsPage.style.display = `block`;

    // Used to clear the items page if there were previous lists shown
    itemsPage.innerHTML = '';
    
    const itemHTML = `
    <div class="container">
        <h2 class="title-items">${listName}</h2>
        <ul class="items">
        
        </ul>       
    </div>`
    
    itemsPage.insertAdjacentHTML('afterbegin', itemHTML);
    itemsContainer = document.querySelector(".items")

    readItems(listName);
    itemsContainer.addEventListener('touchstart', function(event) {
        console.log(event);
        touchStarted = true;
        setTimeout(function() {
            if (touchStarted) {
                event.stopPropagation();
                console.log("Finger is down");
                const touch = event.targetTouches[0];
                const item = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : event.target;
                if (item){
                    console.log(item);
                    item.style.backGroundColor = "lightblue";
                }
            }
        },500);
    })
    itemsContainer.addEventListener('touchend', function(event) {
        touchStarted = false;
    })
    itemsContainer.addEventListener('touchcancel', function(event) {
        touchStarted = false;
    })
    
    itemsContainer.addEventListener("click", async function (event) {
        console.log(event);
        console.log("Was the container clicked for items?");

        // Get the clicked element's action
        const actionElement = event.target.closest("[data-action]");
        if (!actionElement) return; // Exit if no actionable element was clicked
       
        const action = actionElement.dataset.action;
        const parentItem = actionElement.closest(".item");
        const listName = itemsContainer.previousElementSibling.innerHTML;
        const itemId = parentItem?.dataset.id;
        const text = parentItem?.dataset.text;
        const itemIsDone = parentItem?.dataset.is_done;
        const buttonWrapper = parentItem?.querySelector(".button-wrapper");
        const leftCaret = parentItem?.querySelector(".left-caret");
        const rightCaret = parentItem?.querySelector(".right-caret");
    
        switch (action) {
            case "toggle-left-caret":
                // Show buttons and toggle carets
                buttonWrapper.style.display = "flex";
                leftCaret.style.display = "none";
                break;
    
            case "toggle-right-caret":
                // Hide buttons and toggle carets
                buttonWrapper.style.display = "none";
                leftCaret.style.display = "block";
                break;
    
            case "edit-item":
                console.log(`Edit action for item ID: ${itemId}`);
                console.log(`checking the list name: ${listName}`);
                await editItem(itemId, listName); // Call your async edit function
                const data = await readItem(itemId, listName);
                console.log(data);
                parentItem.dataset.text = data.text;
                parentItem.dataset.is_done = data.is_done;
                parentItem.querySelector(".data-text-display").textContent = data.text;

                break;
    
            case "delete-item":
                console.log(`Delete action for item ID: ${itemId}`);
                let deleted = await deleteItem(itemId, listName); // Call your async delete function
                if (deleted) {
                    parentItem.remove();
                }
                break;
    
            case "display-item-description":
                console.log(`Displaying description for item ID: ${itemId}`);
                toggleItemDescription(parentItem, itemIsDone);
                break;
    
            default:
                console.log(`Unhandled action: ${action}`);
                break;
        }
    });
}
/**
 * Toggles the item description below a specific item.
 * @param {Element} parentItem - The clicked item element.
 * @param {string} isDone - Indicates whether the item is done ("true" or "false").
 */
function toggleItemDescription(parentItem, isDone) {
    const existingDescriptions = parentItem.nextElementSibling;

    // Check if the description already exists
    if (existingDescriptions && existingDescriptions.classList.contains("item-descriptions-container")) {
        existingDescriptions.remove(); // Remove the existing description
    } else {
        // Add a new description paragraph
        const trueOrFalseHTML =
            isDone === "true" ? `<p>&#9989;</p>` : `<p>&#10060;</p>`; // Checkmark or crossmark

        const itemDescriptionHTML = `
            <div class="item-descriptions-container">
                <p id="item-description">${trueOrFalseHTML}</p>
            </div>
        `;
        parentItem.insertAdjacentHTML("afterend", itemDescriptionHTML);
    }
}
async function deleteItem(itemId, listName) {
    try {
        let confirmDelete = prompt("Are you sure you want to delete this list? (enter confirm or cancel");
  
        while (true) {
            if (!confirmDelete || confirmDelete === "null") {
                continue;
            }
            else if (confirmDelete.toLowerCase() === "confirm"){
                break;
            }
            else if (confirmDelete.toLowerCase() === "cancel"){
                return false;
            }
        }
        const response = await fetch(`http://127.0.0.1:8000/items/${listName}/${itemId}/`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Item deleted successfully");
        return true;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
/**
 * Async function to update a list.
 * @param {string} listName - The current name of the list.
 * @param {string} newName - The new name for the list.
 */
async function editList(listName) {
    try {
        const newName = prompt("Enter the new name for the list:", listName);
        if (!newName) {
            console.error("New name is required.");
            return;
        }
        console.log(newName)
        const url = `http://127.0.0.1:8000/lists/${listName}/?new_name=${newName}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        // Log the response status for debugging
        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Failed to update list with name: ${listName}. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully updated list with name: ${listName}`, data);
    } catch (error) {
        console.error("Error updating list:", error);
    }
}
/**
 * Example async edit function.
 * @param {string} itemId - The ID of the item to edit.
 * @param {string} itemIsDone - The current status of the item ("true" or "false").
 * @param {string} listName - The name of the list associated with the item.
 * @param {string} text - The new text for the item.
 */
async function editItem(itemId, listName) {
    try {
        const text = prompt("Enter the new text for the item (leave blank to keep unchanged):");
        let itemIsDone = prompt("Enter the new status for the item (true, false, or leave blank to keep unchanged):");
        itemIsDone = itemIsDone.toLowerCase();
        // Validate `itemIsDone` input
        const isDone = itemIsDone === "true" ? true : itemIsDone === "false" ? false : undefined;

        // Dynamically construct query parameters
        const queryParams = new URLSearchParams();
        if (text !== null && text !== "") {
            queryParams.append("text", text);
        }
        if (isDone !== undefined) {
            queryParams.append("is_done", isDone);
        }
        console.log("here is what were changing")
        console.log(text);
        console.log(isDone);
        // Log the constructed URL for debugging
        const url = `http://127.0.0.1:8000/items/${listName}/${itemId}/?${queryParams}`;
        console.log("Constructed URL:", url);

        // Send the PUT request
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
            },
        });

        // Log the response status for debugging
        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Failed to edit item with ID: ${itemId}. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully edited item with ID: ${itemId}`, data);
    } catch (error) {
        console.error("Error editing item:", error);
    }
}


hamburger.addEventListener("click", displaySidebar)    
searchButton.addEventListener("click", function(event){
    console.log("Search button clicked");
    if (listsPage.style.display === "block"){
        console.log("searching for list")
        scrollToSearchedList(prompt("Enter the list name you want to search for:"));
    }
    else if (itemsPage.style.display === "block"){
        console.log("searching for item")
        scrollToSearchedItem(prompt("Enter the item text you want to search for:"));
    }
    console.log("something wrong")
})
backButton.addEventListener("click", displayListsPage)

listsContainer.addEventListener('click', async function (event) {
    console.log("Was the container clicked?");

    // Get the clicked element's action
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return; // Exit if no actionable element was clicked

    const action = actionElement.dataset.action;
    const parentList = actionElement.closest(".list");
    const listId = parentList?.dataset.id;
    listName = parentList?.dataset.name;
    console.log(listName);
    const buttonWrapper = parentList?.querySelector(".button-wrapper");
    const leftCaret = parentList?.querySelector(".left-caret");
    const rightCaret = parentList?.querySelector(".right-caret");

    switch (action) {
        case "toggle-left-caret":
            buttonWrapper.style.display = "flex";
            leftCaret.style.display = "none";
            break;

        case "toggle-right-caret":
            console.log(`Toggling right-caret for list ID: ${listId}`);
            buttonWrapper.style.display = "none";
            leftCaret.style.display = "block";
            break;

        case "edit-list":
            console.log(`Edit action for list ID: ${listId}`);
            await editList(listName);
            const data = await readList(listId);
            parentList.dataset.name = data.name;
            parentList.querySelector(".list-name").textContent = data.name;
            break;

        case "delete-list":
            console.log(`Delete action for list ID: ${listId}`);
            let deleted = await deleteList(listId);
            if (deleted){
                parentList.remove();
            }
            
            break;

        case "display-items":
            console.log(`Displaying items for list: ${listName} (ID: ${listId})`);
            displayItemsPage(listId, listName); // Your logic to show the items page
            break;

        default:
            console.log(`Unhandled action: ${action}`);
            break;
    }
});
async function readList(listId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/lists/${listId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("List data:", data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
async function deleteList(listId) {
    try {
        let confirmDelete = null;
  
        while (true) {
            confirmDelete = prompt("Are you sure you want to delete this list? (enter confirm or cancel");
            if (!confirmDelete || confirmDelete === "null") {
                
                continue;
            }
            else if (confirmDelete.toLowerCase() === "confirm"){
                break;
            }
            else if (confirmDelete.toLowerCase() === "cancel"){
                return false;
            }
        }
        
        const response = await fetch(`http://127.0.0.1:8000/lists/${listId}/`,{
            method: 'DELETE'});
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return true;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
// Async function to make the POST request
async function createList(listName) {
    try {
        
        console.log("before the fetch request");

        const response = await fetch('http://127.0.0.1:8000/lists/', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Accept': 'application/json', // Expect JSON in response
                'Content-Type': 'application/json', // Sending JSON data
            },
            body: JSON.stringify({ name: listName }), // Send the list name as JSON
        });

        console.log(response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("response ok");
        const data = await response.json();
        console.log("List created successfully:", data);


        // Insert the new list into the DOM
        const listHtml = `
            <li class="list" data-action = "display-items" data-id="${data.id}" data-name="${data.name}">
                <p class="list-name">${data.name}</p>
                <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
                <div class="button-wrapper" style="display: none;">
                    <p class="right-caret data-action="toggle-right-caret">&#8250;</p>
                    <p class="edit-button" data-action="edit-list">&#9998;</p>
                    <p class="delete-button" data-action="delete-list">&#128465;</p>
                </div>
            </li>
        `;
        console.log(listHtml);

        listsContainer.insertAdjacentHTML('beforeend', listHtml);
        console.log("List inserted into DOM");

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
async function readItems(listName) {
    try{
        const response = await fetch(`http://127.0.0.1:8000/items/${listName}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data){
            console.log("No data found")
            return;
        }
        data.forEach(item => {
            const itemHTML = `
                <li class = "item" data-text = "${item.text}" data-action = "display-item-description" data-id="${item.id}" data-is_done= "${item.is_done}">
                    <p class="data-text-display">${item.text}</p>
                    <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
                    <div class="button-wrapper" style="display: none;">
                        <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                        <p class="edit-button" data-action="edit-item">&#9998;</p>
                        <p class="delete-button" data-action="delete-item">&#128465;</p>
                    </div>
                    
                </li>
            `;
            itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        })
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
async function readItem(itemId, listName) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/items/${listName}/${itemId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        
    }
}
async function createItem(itemText, listName) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/items/${listName}/`, {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Accept': 'application/json', // Expect JSON in response
                'Content-Type': 'application/json', // Sending JSON data
            },
            body: JSON.stringify({ text: itemText, is_done: false}), // Send the list name as JSON
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Item created successfully:", data);
        const itemHtml = `
        <li class = "item" data-text = "${data.text}" data-action = "display-item-description" data-id="${data.id}" data-is_done= "${data.is_done}">
            <p class="data-text-display">${data.text}</p>
            <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
            <div class="button-wrapper" style="display: none;">
                <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                <p class="edit-button" data-action="edit-item">&#9998;</p>
                <p class="delete-button" data-action="delete-item">&#128465;</p>
            </div>
        </li>
        
        `;
        itemsContainer.insertAdjacentHTML('beforeend', itemHtml);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Event listener for the create button
createButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior
    console.log("Create button clicked");
    const listsPageStyles = getComputedStyle(listsPage);
    const listsPageDisplayability = listsPageStyles.getPropertyValue("display");
    if (listsPageDisplayability === "block") {
        
    
        listName = prompt("Enter List Name:");
        console.log(listName);


        // Check if the user entered a name
        if (!listName) {
            console.error("List name is required.");
            return;
        }

        // Call the async function with the list name
        console.log("Calling async function");
        createList(listName);
    }
    else {
        const itemText = prompt("Enter Item Text:");
        console.log(itemText);

        // Check if the user entered a name
        if (!itemText) {
            console.error("Item name is required.");
            return;
        }
        console.log(listName);
        // Call the async function with the list name    
        createItem(itemText, listName);
    }
});



