window.addEventListener("DOMContentLoaded", function(){update()});

async function fetchData() {
    let response = await fetch("/get-budget");
    let budget = await response.json();
    return budget;
}

async function update(){
    const budget = await fetchData();
    console.log(budget);
    if(budget.i.length > 0 || budget.e.length > 0 || budget.s.length > 0){
        var x = document.getElementById("create");
        x.classList.add("hidden");
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
            currentVal.innerHTML = "$100"; //set value example
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
            percentDiv.style.backgroundColor = "red";
            barDiv.appendChild(percentDiv);

            var currentVal = document.createElement("span");
            currentVal.classList.add("current-value");
            currentVal.innerHTML = "$100"; //example value
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