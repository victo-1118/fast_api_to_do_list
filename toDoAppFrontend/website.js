document.addEventListener("DOMContentLoaded", function() {
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

            mainContent.style.marginLeft = `140px`;            
        }
        else {
            console.log(sidebar.style.left)
            sidebar.style.left = `-250px`;
            mainContent.style.marginLeft = `0px`;
        }
        
    }
    function displayListsPage () {
        itemsPage.style.display = `none`
        listsPage.style.display = `block`
    }
    function displayItemsPage () {
        console.log("was i clicked to show items page")
        listsPage.style.display = `none`
        console.log(listsPage.style.display)
        itemsPage.style.display = `block`
    }
    
    hamburger.addEventListener("click", displaySidebar)    
    
    backButton.addEventListener("click", displayListsPage)
    clickForItemsPage.addEventListener("click", displayItemsPage)
});

