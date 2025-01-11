document.addEventListener("DOMContentLoaded", function() {
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
    const listsContainer = document.querySelector(".lists")
    let itemsContainer = null
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
                <li class="item" data-id="1" data-name="Groceries" data-description="banana">Groceries but not same</li>
                <li class="item" data-id="2" data-name="Work Tasks data-description="paperDue">Work Tasks</li>
                <li class="item" data-id="3" data-name="Personal Goals" data-description="225 bench">Personal Goals</li>
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
                    const listDescription = listItem.dataset.description;
                    const itemDescriptionHTML = `
                    <div class="item-descriptions-container">
                        <p id="item-description">${listDescription}</p>
                        <p>&#9989;</p>
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
            const listName = listItem.dataset.name; // Access data-name
            displayItemsPage(listId, listName);
        }
    });
    
});

