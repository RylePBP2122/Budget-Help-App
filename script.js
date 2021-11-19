document.addEventListener("DOMContentLoaded", update);

function update () {
    document.getElementById("add-savings").addEventListener("click",function _add(){addRow("savings")});
    document.getElementById("add-expense").addEventListener("click",function _add(){addRow("expense")});
    document.getElementById("submit").addEventListener("click",function(){submit()});
    window.sessionStorage.clear();
}

function addRow(type) {
    if (window.sessionStorage.getItem(type) == null){
       var data = [];
    } else {
        var data = JSON.parse(window.sessionStorage.getItem(type));
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
        window.sessionStorage.setItem(type, JSON.stringify(data));

        var table = document.querySelector("." + type+ " table");
        var row = table.insertRow(index+1);
        var cellType = row.insertCell(0);
        var cellCost = row.insertCell(1);
        var edit = row.insertCell(2);
        var del = row.insertCell(3);
    
        cellType.innerHTML = data[index][0];
        cellCost.innerHTML = "$" + data[index][1];
        edit.innerHTML = "<button id='delete' type='button'>Edit</button>";
        edit.addEventListener("click",function _edit(){editRow(type,data[index][2])});
        del.innerHTML = "<button id='delete' type='button'>Delete</button>";
        del.addEventListener("click",function _remove(){removeRow(type,data[index][2])});
    }
}

function removeRow(type, index){
    var table = document.querySelector("." + type+ " table");
    table.deleteRow((index+1));

    var data = JSON.parse(window.sessionStorage.getItem(type));
    data.splice(index,1)

    for (var i = 0; i < data.length; i++){
        data[i][2] = i;
        table.rows[i+1].cells[2].removeEventListener("click", _edit);
        table.rows[i+1].cells[2].addEventListener("click", addEventListener("click",function _edit(){editRow(type,i)}));
        table.rows[i+1].cells[3].removeEventListener("click", _remove);
        table.rows[i+1].cells[3].addEventListener("click", addEventListener("click",function _remove(){editRow(type,i)}));
    }
    window.sessionStorage.setItem(type,JSON.stringify(data)); 
}

function editRow(type,index){
	var data = JSON.parse(window.sessionStorage.getItem(type));
	
	document.getElementById(type + "-type").value = data[index][0];
	document.getElementById(type + "-cost").value = data[index][1];

	document.getElementById("add-" + type).innerHTML = "Save";

}

function submit() {
    var name = document.getElementById("name").value;
    var income = document.getElementById("income").value;

    if (window.localStorage.getItem("expense") != null){
        var expenses = JSON.parse(window.sessionStorage.getItem("expense"));
    } else 
        var expenses = [];
    if (window.localStorage.getItem("savings") != null){
        var savings = JSON.parse(window.sessionStorage.getItem("savings"));
    } else 
        var savings = [];

    var budget = {
        "name":name,
        "income":name,
        "expenses":expenses,
        "savings":savings
    }
    
    window.sessionStorage.removeItem("expense");
    window.sessionStorage.removeItem("savings");
    window.localStorage.setItem("budget",JSON.stringify(budget));
}

function showHidden (divId, input, val){
    if(input.value == val){
        document.getElementById(divId).style.display = "block";
    } else {
        document.getElementById(divId).style.display = "none";
    }
}