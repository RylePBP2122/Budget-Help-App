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
        var budget = getData();
        var ul = document.getElementById("overview-list");

        budget.i.forEach(e => {
            var li = document.createElement("li");
            li.classList.add("budget-item");
            ul.appendChild(li);

            var nameDiv = document.createElement("div");
            nameDiv.classList.add("budget-name");
            nameDiv.innerHTML = e[0];
            li.appendChild(nameDiv);

            var barDiv = document.createElement("div");
            barDiv.classList.add("budget-bar");
            li.appendChild(barDiv);

            var percentDiv = document.createElement("div");
            percentDiv.classList.add("budget-percentage");
            var p = Math.floor((100/e[4])*100); // Set to 100 for example need to implement real data
            percentDiv.style.width = p + "%";
            barDiv.appendChild(percentDiv);

            var currentVal = document.createElement("span");
            currentVal.classList.add("current-value");
            currentVal.innerHTML = "$0";
            if (p > 20)
                currentVal.style.color = "white";
            percentDiv.appendChild(currentVal);

            var totalDiv = document.createElement("div");
            totalDiv.classList.add("total-value");
            totalDiv.innerHTML = "$" + e[4];
            li.appendChild(totalDiv);
        });

        budget.e.forEach(e => {
            var li = document.createElement("li");
            li.classList.add("budget-item");
            ul.appendChild(li);

            var nameDiv = document.createElement("div");
            nameDiv.classList.add("budget-name");
            nameDiv.innerHTML = e[0];
            li.appendChild(nameDiv);

            var barDiv = document.createElement("div");
            barDiv.classList.add("budget-bar");
            li.appendChild(barDiv);

            var percentDiv = document.createElement("div");
            percentDiv.classList.add("budget-percentage");
            var p = Math.floor((100/e[4])*100); // Set to 100 for example need to implement real data
            percentDiv.style.width = p + "%";
            barDiv.appendChild(percentDiv);

            var currentVal = document.createElement("span");
            currentVal.classList.add("current-value");
            currentVal.innerHTML = "$0";
            if (p > 20)
                currentVal.style.color = "white";
            percentDiv.appendChild(currentVal);

            var totalDiv = document.createElement("div");
            totalDiv.classList.add("total-value");
            totalDiv.innerHTML = "$" + e[4];
            li.appendChild(totalDiv);
        })

    } else {
        var x = document.getElementById("overview");
        x.classList.add("hidden");
    }
}


//css functions

function showDiv(classID){
    var x = document.querySelector(classID);
    x.classList.toggle("hidden");
}