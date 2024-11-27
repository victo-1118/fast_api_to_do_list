document.addEventListener("DOMContentLoaded", function() {
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
    
    hamburger.addEventListener("click", displaySidebar)    
});

