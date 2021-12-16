window.addEventListener("DOMContentLoaded", function(){update()});

function hasBudget(){
    if (window.localStorage.getItem("budget") != null)
        return true;
    return false;
}

function getData(){
    return JSON.parse(window.localStorage.getItem("budget"));
}

function update(){
    if(hasBudget()){
        var x = document.getElementById("create");
        x.classList.add("hidden");
    } else {
        var x = document.getElementById("overview");
        x.classList.add("hidden");
    }
}


//css functions

function showDiv(divId){
    var x = document.getElementById(divId);
    x.classList.toggle("hidden");
}