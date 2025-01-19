
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
            <li class="list" data-id="${list.id}" data-name="${list.name}">
                <p class="list-name">${list.name}</p>
                <p class="left-caret">&#8249;</p>
                
                <div class="button-wrapper" style="display: none;">
                    <p class="right-caret">&#8250;</p>
                    <p class="edit-button">&#9998;</p>
                    <p class="delete-button">&#128465;</p>
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
const itemsPage = document.getElementById("items-page")

const listsContainer = document.querySelector(".lists")
let itemsContainer = null
let listName = null;
const createButton = document.querySelector(".sidebar-item:nth-child(1)");
const backButton = document.getElementById('back-to-lists');
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");


function displaySidebar () {
    
    if (sidebar.style.left === "-130px" || sidebar.style.left === ""){
        sidebar.style.left = `0`;

            
        listsPage.style.marginLeft = `130px`         
        itemsPage.style.marginLeft = `130px`
        listsPage.style.width = `calc(100% - 130px)`
        itemsPage.style.width = `calc(100% - 130px)`
    }
    else {
        console.log(sidebar.style.left)
        sidebar.style.left = `-130px`;
        
        listsPage.style.marginLeft = `0px`
        itemsPage.style.marginLeft = `0px`
        listsPage.style.width = `100%`
        itemsPage.style.width = `100%`
    }
    
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
    
    itemsContainer.addEventListener('click', function (event) {
        console.log(event);
        console.log("Was the container clicked for items?");
        const leftCaret = event.target.closest(".left-caret");
        if (leftCaret) {
            const parentItem = leftCaret.closest(".item"); // Find the parent .list container
            const buttonWrapper = parentItem.querySelector(".button-wrapper");

            // Show the buttons and replace the caret
            buttonWrapper.style.display = "flex"; // Show edit and delete buttons
            leftCaret.style.display = "none"; // Hide the left caret
            return;
        }

        // Handle the right caret click
        const rightCaret = event.target.closest(".right-caret");
        if (rightCaret) {
            const parentItem = rightCaret.closest(".item"); // Find the parent .list container
            const buttonWrapper = parentItem.querySelector(".button-wrapper");

            // Hide the buttons and replace the caret
            buttonWrapper.style.display = "none"; // Hide edit and delete buttons
            parentItem.querySelector(".left-caret").style.display = "block"; // Show the left caret
            return;
        }
        const listItem = event.target.closest(".item");
        if (listItem) {
            const existingDescriptions = listItem.nextElementSibling;
            console.log(existingDescriptions)    
            // Check if the next sibling is the description paragraph
            if (existingDescriptions && existingDescriptions.classList.contains("item-descriptions-container")) {                    // Remove the existing description
                existingDescriptions.remove();
            } else {
                // Add a new description paragraph
                const listItemDescription = listItem.dataset.is_done;
                const trueOrFalseHTML = `<p>&#10060;</p>`
                if (listItemDescription === "true") {
                    trueOrFalseHTML = `<p>>&#9989;</p>`
                }
                const itemDescriptionHTML = `
                <div class="item-descriptions-container">
                    <p id="item-description">${trueOrFalseHTML}</p>

                </div>`;
                listItem.insertAdjacentHTML('afterend', itemDescriptionHTML);
            }
        }
    });
    
}

hamburger.addEventListener("click", displaySidebar)    

backButton.addEventListener("click", displayListsPage)

listsContainer.addEventListener('click', function (event) {
    console.log("Was the container clicked");

    // Handle the left caret click
    const leftCaret = event.target.closest(".left-caret");
    if (leftCaret) {
        const parentList = leftCaret.closest(".list"); // Find the parent .list container
        const buttonWrapper = parentList.querySelector(".button-wrapper");

        // Show the buttons and replace the caret
        buttonWrapper.style.display = "flex"; // Show edit and delete buttons
        leftCaret.style.display = "none"; // Hide the left caret
        return;
    }

    // Handle the right caret click
    const rightCaret = event.target.closest(".right-caret");
    if (rightCaret) {
        const parentList = rightCaret.closest(".list"); // Find the parent .list container
        const buttonWrapper = parentList.querySelector(".button-wrapper");

        // Hide the buttons and replace the caret
        buttonWrapper.style.display = "none"; // Hide edit and delete buttons
        parentList.querySelector(".left-caret").style.display = "block"; // Show the left caret
        return;
    }

    // Handle clicking on a list
    const listItem = event.target.closest(".list");
    if (listItem) {
        const listId = listItem.dataset.id; // Access data-id
        const listName = listItem.dataset.name; // Access data-name
        console.log(`Clicked list: ${listName} (ID: ${listId})`);
        displayItemsPage(listId, listName); // Your logic for navigating to the items page
    }
});

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
            <li class="list" data-id="${data.id}" data-name="${data.name}">
                <p class="list-name">${data.name}</p>
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
                <li class = "item" data-id="${item.id}" data-is_done= "${item.is_done}">
                    <p>${item.text}</p>
                    <p class="left-caret">&#8249;</p>
                
                    <div class="button-wrapper" style="display: none;">
                        <p class="right-caret">&#8250;</p>
                        <p class="edit-button">&#9998;</p>
                        <p class="delete-button">&#128465;</p>
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
        <li class = "item" data-id="${data.id}" data-is_done= "${data.is_done}">${data.text}</li>
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
        console.log(listsPage.style.display);
        const itemText = prompt("Enter Item Text:");
        console.log(itemText);

        // Check if the user entered a name
        if (!itemText) {
            console.error("Item name is required.");
            return;
        }

        // Call the async function with the list name    
        createItem(itemText, listName);
    }
});



