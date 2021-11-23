document.addEventListener("DOMContentLoaded", update);

function update () {
    document.getElementById("add-savings").addEventListener("click",function(){addRow("savings",-1)});
    document.getElementById("add-expense").addEventListener("click",function(){addRow("expense",-1)});
    document.getElementById("submit").addEventListener("click",function(){submit()});
    window.sessionStorage.clear();
}

function addRow(type,index) {
    document.getElementById("edit-" + type).style.display = "none";
    document.getElementById("add-" + type).style.display = "block";  

    if (window.sessionStorage.getItem(type) == null){
       var data = [];
    } else {
        var data = JSON.parse(window.sessionStorage.getItem(type));
    }

    var valueType = document.getElementById(type + "-type").value;
    if (valueType == "custom"){
        valueType = document.getElementById(type + "-custom").value;
        document.getElementById(type + "-custom").value = "";
        document.getElementById("hidden-savings").style.display = "none";

    }
    var valueCost = document.getElementById(type + "-cost").value;

    document.getElementById(type + "-type").value = "";
    document.getElementById(type + "-cost").value = "";

    if (valueType != "" && valueCost != ""){
        if (index != -1){
            data.splice(index-1,1,[valueType,valueCost]);
            window.sessionStorage.setItem(type, JSON.stringify(data));
            
            var table = document.querySelector("." + type+ " table");
            table.rows[index].cells[0].innerHTML = valueType;
            table.rows[index].cells[1].innerHTML = "$" + valueCost;
        } else {
            data.push([valueType,valueCost]);
            window.sessionStorage.setItem(type, JSON.stringify(data));
            
            var table = document.querySelector("." + type+ " table");
            var row = table.insertRow(index);
            var cellType = row.insertCell(0);
            var cellCost = row.insertCell(1);
            var edit = row.insertCell(2);
            var del = row.insertCell(3);
        
            cellType.innerHTML = valueType;
            cellCost.innerHTML = "$" + valueCost;
            edit.innerHTML = "<button id='delete' type='button'>Edit</button>";
            edit.addEventListener("click", function(){editRow(type, edit.firstChild)});
            del.innerHTML = "<button id='delete' type='button'>Delete</button>";
            del.addEventListener("click", function(){removeRow(type, del.firstChild)});
        }     
    }
}

function removeRow(type, btn){
    var td = btn.parentNode;
    var tr = td.parentNode;

    var data = JSON.parse(window.sessionStorage.getItem(type));
    data.splice(tr.rowIndex-1,1)
    window.sessionStorage.setItem(type,JSON.stringify(data));

    tr.parentNode.removeChild(tr);
}

function editRow(type,btn){
    var data = JSON.parse(window.sessionStorage.getItem(type));

    var td = btn.parentNode;
    var tr = td.parentNode;
    index = tr.rowIndex;
	
    if (type == "savings" && data[index-1][0] != "Emergency"){
        
        document.getElementById("hidden-savings").style.display = "block";
        document.getElementById(type + "-type").value = "custom";
        document.getElementById(type + "-custom").value = data[index-1][0];
        document.getElementById(type + "-cost").value = data[index-1][1];
    } else {
        document.getElementById(type + "-type").value = data[index-1][0];
	    document.getElementById(type + "-cost").value = data[index-1][1];
    }

	document.getElementById("edit-" + type).style.display = "block";
    document.getElementById("add-" + type).style.display = "none";

    document.getElementById("edit-" + type).addEventListener("click",function(){addRow(type,index)});
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