window.addEventListener("DOMContentLoaded", function(){update()});

async function fetchData() {
    let response = await fetch("/get-budget");
    let budget = await response.json();
    return budget;
}

async function update(){
    const budget = await fetchData();
    var budgetTypes = [];

    budget.e.forEach(e => {
        if(!budgetTypes.includes(e[0]))
            budgetTypes.push(e[0]);
    });
    budget.i.forEach(e => {
        if(!budgetTypes.includes(e[0]))
            budgetTypes.push(e[0]);
    });
    budget.s.forEach(e => {
        if(!budgetTypes.includes(e[0]))
            budgetTypes.push(e[0]);
    });

    var dropdown = document.getElementById("budget-dropdown");
    budgetTypes.forEach(e => {
        var option = document.createElement("option");
        option.value = e;
        option.innerHTML = e;
        dropdown.appendChild(option);
    });
}

function edit(btn){
    var form = document.getElementById("form");
    var index = btn.parentNode.parentNode.rowIndex;
    form.date
}