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
        console.log("should be succesful")
    }
    loadSideBar();
    const listsPage = document.getElementById('lists-page');
    const itemsPage = document.getElementById("items-page")
    const clickForItemsPage = document.querySelector(".lists")
    console.log(clickForItemsPage)
    const backButton = document.getElementById('back-to-lists');
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".container");
    
    console.log("not clicked");
    
    function displaySidebar () {
        console.log("clicked");
        if (sidebar.style.left === "-250px" || sidebar.style.left === ""){
            console.log(":)")
            sidebar.style.left = `0`;

               
            listsPage.style.marginLeft = `140px`         
            itemsPage.style.marginLeft = `140px`
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
    function displayItemsPage () {
        listsPage.style.visibility = `hidden`
        itemsPage.style.visibility = `visible`
    }
    
    hamburger.addEventListener("click", displaySidebar)    
    
    backButton.addEventListener("click", displayListsPage)
    clickForItemsPage.addEventListener("click", displayItemsPage)
});

