document.addEventListener("DOMContentLoaded", update);

function update () {
    document.getElementById("add-savings").addEventListener("click",function(){addRow("savings")});
    document.getElementById("add-expense").addEventListener("click",function(){addRow("expense")});
    document.getElementById("submit").addEventListener("click",function(){submit()});

    //updateTable("expense");
   // updateTable("savings");
}

function updateTable(type,index){
    if (window.localStorage.getItem(type) != null){
        var data = JSON.parse(window.localStorage.getItem(type));
        
        var table = document.querySelector("." + type+ " table");

        table = document.querySelector("." + type+ " table");
        var row = table.insertRow(index+1);
        var cellType = row.insertCell(0);
        var cellCost = row.insertCell(1);
        var edit = row.insertCell(2);
        var del = row.insertCell(3);
    
        cellType.innerHTML = data[index][0];
        cellCost.innerHTML = "$" + data[index][1];
        edit.innerHTML = "<button id='delete' type='button'>Edit</button>";
        edit.addEventListener("click",function(){editRow(type,data[2])});
        del.innerHTML = "<button id='delete' type='button'>Delete</button>";
        del.addEventListener("click",function(){removeRow(type,data[2])});
    }
}

function addRow(type) {
    if (window.localStorage.getItem(type) == null){
       var data = [];
    } else {
        var data = JSON.parse(window.localStorage.getItem(type));
    }

    var valueType = document.getElementById(type + "-type").value;
    if (valueType == "custom"){
        valueType = document.getElementById(type + "-custom").value;
        document.getElementById(type + "-custom").value = "";
    }
    var valueCost = document.getElementById(type + "-cost").value;

    document.getElementById(type + "-type").value = "";
    document.getElementById(type + "-cost").value = "";

    if (valueType != "" && valueCost != ""){
        var index = data.length;
        data.push([valueType,valueCost,index]);

        window.localStorage.setItem(type, JSON.stringify(data));

        updateTable(type,index);
    }
}

function removeRow(type, index){
    var data = JSON.parse(window.localStorage.getItem(type));

    data.splice(index,1);

    for (var i = 0; i < data.length; i++){
        data[i][2] = i;
    }
	window.localStorage.setItem(type,JSON.stringify(data));
    updateTable(type);
}

function editRow(type,index){
	var data = JSON.parse(window.localStorage.getItem(type));
	
	document.getElementById(type + "-type").value = data[index][0];
	document.getElementById(type + "-cost").value = data[index][1];

	document.getElementById("add-" + type).innerHTML = "Save";

}

function submit() {
    var name = document.getElementById("name").value;
    var income = document.getElementById("income").value;

    if (window.localStorage.getItem("expense") != null){
        var expenses = JSON.parse(window.localStorage.getItem("expense"));
    } else 
        var expenses = [];
    if (window.localStorage.getItem("savings") != null){
        var savings = JSON.parse(window.localStorage.getItem("savings"));
    } else 
        var savings = [];

    var budget = {
        "name":name,
        "income":name,
        "expenses":expenses,
        "savings":savings
    }
    
    window.localStorage.removeItem("expense");
    window.localStorage.removeItem("savings");
    window.localStorage.setItem("budget",JSON.stringify(budget));
}

function showHidden (divId, input, val){
    if(input.value == val){
        document.getElementById(divId).style.display = "block";
    } else {
        document.getElementById(divId).style.display = "none";
    }
}