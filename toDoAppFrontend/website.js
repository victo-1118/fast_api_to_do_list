
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
const listsPage = document.getElementById('lists-page');
const itemsPage = document.getElementById("items-page")
itemsPage.style.visibility = `visible`;
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
    itemsPage.style.visibility = `hidden`
    listsPage.style.visibility = `visible`
    backButton.style.visibility = `hidden`
    createButton.querySelector("p").textContent = "Create List"
}
function displayItemsPage (listId, listName) {
    createButton.querySelector("p").textContent = "Create Item"
    backButton.style.visibility = `visible`
    console.log(`Loading items for List ID: ${listId}, List Name: ${listName}`);
    listsPage.style.visibility = `hidden`;
    itemsPage.style.visibility = `visible`;

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

    itemsContainer.addEventListener('click', function (event) {
        console.log("Was the container clicked for items?");
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
    console.log("was the container clicked")
    const listItem = event.target.closest(".list")
    console.log(listItem)
    if (listItem) {
        const listId = listItem.dataset.id; // Access data-id
        listName = listItem.dataset.name; // Access data-name
        displayItemsPage(listId, listName);
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
            <div class="list" data-id="${data.id}" data-name="${data.name}">
                <p class="list-name">${data.name}</p>
            </div>
        `;
        console.log(listHtml);

        listsContainer.insertAdjacentHTML('beforeend', listHtml);
        console.log("List inserted into DOM");

    } catch (error) {
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
        <li class = "item" data-id="${data.id}" data-is_Done= "${data.is_done}">${data.text}</li>
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
    const listsPageVisibility = listsPageStyles.getPropertyValue("visibility");
    if (listsPageVisibility === "visible") {
        
    
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
        console.log(listsPage.style.visibility);
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



