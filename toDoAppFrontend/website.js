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
    
    const backButton = document.getElementById('back-to-lists');
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    
    
    function displaySidebar () {
        if (sidebar.style.left === "-250px" || sidebar.style.left === ""){
            sidebar.style.left = `0`;

               
            listsPage.style.marginLeft = `130px`         
            itemsPage.style.marginLeft = `130px`
        }
        else {
            console.log(sidebar.style.left)
            sidebar.style.left = `-250px`;
            
            listsPage.style.marginLeft = `0px`
            itemsPage.style.marginLeft = `0px`
        }
        
    }
    function displayListsPage () {
        itemsPage.style.visibility = `hidden`
        listsPage.style.visibility = `visible`
    }
    function displayItemsPage (listId, listName) {

        console.log(`Loading items for List ID: ${listId}, List Name: ${listName}`);
        listsPage.style.visibility = `hidden`;
        itemsPage.style.visibility = `visible`;

        // Example: Update items page with the list's name or content
    
       
        const itemHTML = `
        <h3>${listId}</h3>
        <div class="container">
            <h2 class="title-items">${listName}</h2>
            
            <ul class="items">
                <li class="item" data-id="1" data-name="Groceries">Groceries but not same</li>
                <li class="item" data-id="2" data-name="Work Tasks">Work Tasks</li>
                <li class="item" data-id="3" data-name="Personal Goals">Personal Goals</li>
            </ul>
        </div>`
        
        itemsPage.insertAdjacentHTML('afterbegin', itemHTML);
        
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

