
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
function updateProgress(progressBar, total, amountTrue){
    debugger;
    if (total === 0){
        return;
    }
    let percentage = 100 - (amountTrue / total)*100;
    console.log(percentage)
    console.log(amountTrue)
    const inner = progressBar.querySelector('.inner p')
    progressBar.style.background = `conic-gradient(#ffffff ${percentage}%, rgba(0, 0, 0, 0.0) 0%),
      radial-gradient(farthest-corner at 54px 4px, #f35 10%, #43e 100%)`
    console.log(progressBar.style.background)
    percentage = Math.round((amountTrue / total) * 100)
    inner.innerHTML = `${percentage}%`
    console.log(inner.innerHTML)
}
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
                <div class="left-button-wrapper">
                    <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                    <div class="circular-progress" data-id="${list.id}" style="display:${list.total_items === 0 ? 'none' : 'block'}">
                        <div class="inner">
                            <p><p>
                        </div>
                    </div>
                </div>
                <div class="button-wrapper" style="display: none;">
                    <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                    <p class="edit-button" data-action="edit-list">&#9998;</p>
                    <p class="delete-button" data-action="delete-list">&#128465;</p>
                    
                    
                </div>
            </li>
            `
            listsContainer.insertAdjacentHTML('beforeend', listHtml);
            const progressBarToAdjust = listsContainer.querySelector(`.circular-progress[data-id="${list.id}"]`);
            updateProgress(progressBarToAdjust,list.total_items, list.completed_items);


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

        
        listsPage.style.marginLeft = `${sidebarWidth}`;
        itemsPage.style.marginLeft = `${sidebarWidth}`;
        listsPage.style.width = `calc(100% - ${sidebarWidth})`;
        itemsPage.style.width = `calc(100% - ${sidebarWidth})`;
    } else {

        
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
function scrollToSearchedItem (itemText) {

    const itemElement = document.querySelector(`.item[data-text="${itemText}"]`);
    console.log(itemElement)
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
        touchStarted = true;
        setTimeout(function() {
            if (touchStarted) {
                event.stopPropagation();
                const touch = event.targetTouches[0];
                const item = touch ? document.elementFromPoint(touch.clientX, touch.clientY) : event.target;
                if (item){
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

                await editItem(itemId, listName); // Call your async edit function
                const data = await readItem(itemId, listName);
                parentItem.dataset.text = data.text;
                parentItem.dataset.is_done = data.is_done;
                if (data.is_done) {
                    parentItem.classList.add("completed-item");
                }
                else {
                    parentItem.classList.remove("completed-item");
                }
                parentItem.querySelector(".data-text-display").textContent = data.text;

                break;
    
            case "delete-item":
                let deleted = await deleteItem(itemId, listName); // Call your async delete function
                if (deleted) {
                    parentItem.remove();
                }
                break;
    
            case "display-item-description":
                toggleItemDescription(parentItem, itemIsDone);
                break;
    
            default:
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
        const url = `http://127.0.0.1:8000/lists/${listName}/?new_name=${newName}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        // Log the response status for debugging

        if (!response.ok) {
            throw new Error(`Failed to update list with name: ${listName}. Status: ${response.status}`);
        }

        const data = await response.json();
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

        // Log the constructed URL for debugging
        const url = `http://127.0.0.1:8000/items/${listName}/${itemId}/?${queryParams}`;

        // Send the PUT request
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
            },
        });

        // Log the response status for debugging

        if (!response.ok) {
            throw new Error(`Failed to edit item with ID: ${itemId}. Status: ${response.status}`);
        }


    } catch (error) {
        console.error("Error editing item:", error);
    }
}


hamburger.addEventListener("click", displaySidebar)    
searchButton.addEventListener("click", function(event){
    if (listsPage.style.display === "block"){
        scrollToSearchedList(prompt("Enter the list name you want to search for:"));
    }
    else if (itemsPage.style.display === "block"){
        scrollToSearchedItem(prompt("Enter the item text you want to search for:"));
    }
})
backButton.addEventListener("click", displayListsPage)

listsContainer.addEventListener('click', async function (event) {

    // Get the clicked element's action
    const actionElement = event.target.closest("[data-action]");
    if (!actionElement) return; // Exit if no actionable element was clicked

    const action = actionElement.dataset.action;
    const parentList = actionElement.closest(".list");
    const listId = parentList?.dataset.id;
    listName = parentList?.dataset.name;
    const buttonWrapper = parentList?.querySelector(".button-wrapper");
    const leftCaret = parentList?.querySelector(".left-caret");
    const leftButtonWrapper = parentList?.querySelector(".left-button-wrapper");

    switch (action) {
        case "toggle-left-caret":
            buttonWrapper.style.display = "flex";
            leftButtonWrapper.style.display = "none";
            break;

        case "toggle-right-caret":
            buttonWrapper.style.display = "none";
            leftButtonWrapper.style.display = "flex";
            break;

        case "edit-list":
            await editList(listName);
            const data = await readList(listId);
            parentList.dataset.name = data.name;
            parentList.querySelector(".list-name").textContent = data.name;
            leftButtonWrapper = parentList.querySelector("left-button-wrapper")
            leftButtonWrapper.insertAdjacentHTML('beforeend', `<div class="circular-progress" style="display:${data.total_items === 0 ? 'none' : 'block'}">
                <div class="inner">
                    <p><p>
                </div>
            </div>`)
            updateProgress(data.total_items, data.completed_items);
            break;

        case "delete-list":
            let deleted = await deleteList(listId);
            if (deleted){
                parentList.remove();
            }
            
            break;

        case "display-items":
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
        

        const response = await fetch('http://127.0.0.1:8000/lists/', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Accept': 'application/json', // Expect JSON in response
                'Content-Type': 'application/json', // Sending JSON data
            },
            body: JSON.stringify({ name: listName }), // Send the list name as JSON
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        console.log(data.total_items === 0 ? 'none' : 'block')

        // Insert the new list into the DOM
        const listHtml = `
            <li class="list" data-action = "display-items" data-id="${data.id}" data-name="${data.name}">
                <p class="list-name">${data.name}</p>
                <div class="left-button-wrapper">
                    <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                    <div class="circular-progress" style="display:${data.total_items === 0 ? 'none' : 'block'}">
                        <div class="inner">
                            <p><p>
                        </div>
                    </div>
                </div>
                
                <div class="button-wrapper" style="display: none;">
                    <p class="right-caret data-action="toggle-right-caret">&#8250;</p>
                    <p class="edit-button" data-action="edit-list">&#9998;</p>
                    <p class="delete-button" data-action="delete-list">&#128465;</p>
                    
                </div>
            </li>
        `;
        listsContainer.insertAdjacentHTML('beforeend', listHtml);
        updateProgress(data.total_items, data.completed_items);

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
        let itemFalseHTML = '';
        let itemTrueHTML = '';
        data.forEach(item => {
            if (!item.is_done){
                itemFalseHTML = itemFalseHTML + `
                <li class = "item " data-text = "${item.text}" data-action = "display-item-description" data-id="${item.id}" data-is_done= "${item.is_done}">
                    <p class="data-text-display">${item.text}</p>

                    <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
                    <div class="button-wrapper" style="display: none;">
                        <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                        <p class="edit-button" data-action="edit-item">&#9998;</p>
                        <p class="delete-button" data-action="delete-item">&#128465;</p>
                    </div>
                    
                </li>

            `;
                
                return;
            }
            else{
            
                itemTrueHTML = itemTrueHTML + `
                <li class = "item completed-item" data-text = "${item.text}" data-action = "display-item-description" data-id="${item.id}" data-is_done= "${item.is_done}">
                    <p class="data-text-display">${item.text}</p>
                    <p class="left-caret" data-action="toggle-left-caret">&#8249;</p>
                
                    <div class="button-wrapper" style="display: none;">
                        <p class="right-caret" data-action="toggle-right-caret">&#8250;</p>
                        <p class="edit-button" data-action="edit-item">&#9998;</p>
                        <p class="delete-button" data-action="delete-item">&#128465;</p>
                    </div>
                    
                </li>

                `;
                
            }

        })
        itemsContainer.insertAdjacentHTML('beforeend', itemFalseHTML);
        itemsContainer.insertAdjacentHTML('beforeend', itemTrueHTML);
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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
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
    const listsPageStyles = getComputedStyle(listsPage);
    const listsPageDisplayability = listsPageStyles.getPropertyValue("display");
    if (listsPageDisplayability === "block") {
        
    
        listName = prompt("Enter List Name:");

        // Check if the user entered a name
        if (!listName) {
            console.error("List name is required.");
            return;
        }

        // Call the async function with the list name
        createList(listName);
    }
    else {
        const itemText = prompt("Enter Item Text:");

        // Check if the user entered a name
        if (!itemText) {
            console.error("Item name is required.");
            return;
        }
        // Call the async function with the list name    
        createItem(itemText, listName);
    }
});



