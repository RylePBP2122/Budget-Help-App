document.addEventListener("DOMContentLoaded", update);

function update () {
    document.getElementById("add-savings").addEventListener("click",function(){addRow("savings",-1)});
    document.getElementById("add-expense").addEventListener("click",function(){addRow("expense",-1)});
    document.getElementById("add-income").addEventListener("click",function(){addRow("income",-1)});
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
    var custom = false;
    if (valueType == "custom"){
        custom = true;
        valueType = document.getElementById(type + "-custom").value;
        document.getElementById(type + "-custom").value = "";
        document.getElementById("hidden-" + type).style.display = "none";

    }
    var valueCost = document.getElementById(type + "-cost").value;
    var valueFreq = document.getElementById(type + "-frequency").value;

    document.getElementById(type + "-type").value = "";
    document.getElementById(type + "-cost").value = "";
    document.getElementById(type + "-frequency").value = "";


    if (valueType != "" && valueCost != "" && valueFreq != ""){
        if (data.length == 0)
            document.getElementById(type + "-table").style.display = "block";
        if (index != -1){
            data.splice(index-1,1,[valueType,valueCost,valueFreq,custom]);
            window.sessionStorage.setItem(type, JSON.stringify(data));
            
            var table = document.querySelector("." + type+ " table");
            table.rows[index].cells[0].innerHTML = valueType;
            table.rows[index].cells[1].innerHTML = "$" + valueCost;
            table.rows[index].cells[2].innerHTML = valueFreq;
        } else {
            data.push([valueType,valueCost,valueFreq,custom]);
            window.sessionStorage.setItem(type, JSON.stringify(data));
            
            var table = document.querySelector("." + type+ " table");
            var row = table.insertRow(index);
            var cellType = row.insertCell(0);
            var cellCost = row.insertCell(1);
            var cellFreq = row.insertCell(2);
            var edit = row.insertCell(3);
            var del = row.insertCell(4);
        
            cellType.innerHTML = valueType;
            cellCost.innerHTML = "$" + valueCost;
            cellFreq.innerHTML = valueFreq;
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
    if (data.length == 0)
        document.getElementById(type + "-table").style.display = "none";
}

function editRow(type,btn){
    var data = JSON.parse(window.sessionStorage.getItem(type));

    var td = btn.parentNode;
    var tr = td.parentNode;
    index = tr.rowIndex;
	
    if (data[index-1][3] == true){
        document.getElementById("hidden-" + type).style.display = "block";
        document.getElementById(type + "-type").value = "custom";
        document.getElementById(type + "-custom").value = data[index-1][0];
        document.getElementById(type + "-cost").value = data[index-1][1];
        document.getElementById(type + "-frequency").value = data[index-1][2];
    } else {
        document.getElementById(type + "-type").value = data[index-1][0];
	    document.getElementById(type + "-cost").value = data[index-1][1];
        document.getElementById(type + "-frequency").value = data[index-1][2];
    }

	document.getElementById("edit-" + type).style.display = "block";
    document.getElementById("add-" + type).style.display = "none";

    document.getElementById("edit-" + type).addEventListener("click",function(){addRow(type,index)});
}

function submit() {
    var name = document.getElementById("name").value;

    if (window.sessionStorage.getItem("expense") != null){
        var expenses = JSON.parse(window.sessionStorage.getItem("expense"));
    } else 
        var expenses = [];
    if (window.sessionStorage.getItem("savings") != null){
        var savings = JSON.parse(window.sessionStorage.getItem("savings"));
    } else 
        var savings = [];
    if (window.sessionStorage.getItem("income") != null){
        var income = JSON.parse(window.sessionStorage.getItem("income"));
    } else 
        var income = [];

    var budget = {
        "name":name,
        "income":income,
        "expenses":expenses,
        "savings":savings
    }
    
    window.sessionStorage.removeItem("expense");
    window.sessionStorage.removeItem("savings");
    window.sessionStorage.removeItem("income");
    window.localStorage.setItem("budget",JSON.stringify(budget));
}

function showHidden (divId, input, val){
    if(input.value == val){
        document.getElementById(divId).style.display = "block";
    } else {
        document.getElementById(divId).style.display = "none";
    }
}