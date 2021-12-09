document.addEventListener("DOMContentLoaded", update);

function update () {
    document.getElementById("add-savings").addEventListener("click",function(){addRow("savings",-1)});
    document.getElementById("add-expense").addEventListener("click",function(){addRow("expense",-1)});
    document.getElementById("add-income").addEventListener("click",function(){addRow("income",-1)});
    document.getElementById("submit").addEventListener("click",function(){submit()});
    window.sessionStorage.clear();
}

function showHidden (divId, input, val){
    if(input.value == val){
        document.getElementById(divId).style.display = "block";
    } else {
        document.getElementById(divId).style.display = "none";
    }
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
    var valueCost = parseInt(document.getElementById(type + "-cost").value);
    var valueFreq = document.getElementById(type + "-frequency").value;

    document.getElementById(type + "-type").value = "";
    document.getElementById(type + "-cost").value = "";
    document.getElementById(type + "-frequency").value = "";


    if (valueType != "" && valueCost != "" && valueFreq != ""){
        if (data.length == 0){
            document.getElementById(type + "-table").classList.toggle("hidden");
            document.getElementById(type + "-overview-table").classList.toggle("hidden");
        }
        if (index != -1){
            if (type == "savings"){
                var goalData = dateData(valueFreq,valueCost);
                data.splice(index-1,1,[valueType,valueCost,valueFreq,custom,goalData[0],goalData[1]]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            } else {
                if (valueFreq == "Weekly")
                    var pay = valueCost*4;
                else
                    var pay = valueCost;
                data.splice(index-1,1,[valueType,valueCost,valueFreq,custom,pay]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            }
            var table = document.querySelector("." + type+ " table");
            table.rows[index].cells[0].innerHTML = valueType;
            table.rows[index].cells[1].innerHTML = "$" + valueCost;
            table.rows[index].cells[2].innerHTML = valueFreq;
        } else {
            if (type == "savings"){
                var goalData = dateData(valueFreq,valueCost);
                data.push([valueType,valueCost,valueFreq,custom,goalData[0],goalData[1]]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            } else {
                if (valueFreq == "Weekly")
                    var pay = valueCost*4;
                else
                    var pay = valueCost;
                data.push([valueType,valueCost,valueFreq,custom,pay]);
                window.sessionStorage.setItem(type, JSON.stringify(data));
            }
            
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
        updateOverview();

        var oTable = document.getElementById(type + "-overview-table");

        if (index != -1){
            if(type == "savings"){
                oTable.rows[index].cells[0].innerHTML = valueType;
                oTable.rows[index].cells[1].innerHTML = goalData[0];
                oTable.rows[index].cells[2].innerHTML = "$" + goalData[1];
            } else {
                oTable.rows[index].cells[0].innerHTML = valueType;
                oTable.rows[index].cells[1].innerHTML = "$" + pay;
            }
        } else {
            var oRow = oTable.insertRow();
            if (type == "savings"){
                var cellName = oRow.insertCell(0);
                var cellMonths = oRow.insertCell(1);
                var cellPay  = oRow.insertCell(2);
                cellName.innerHTML = valueType;
                cellMonths.innerHTML = goalData[0];
                cellPay.innerHTML = "$" + goalData[1];
            } else {
                var cellName = oRow.insertCell(0);
                var cellPay  = oRow.insertCell(1);
                cellName.innerHTML = valueType;
                cellPay.innerHTML = "$" + pay;
            }
        }     
    }
}

function removeRow(type, btn){
    var td = btn.parentNode;
    var tr = td.parentNode;
    var index = tr.rowIndex;

    var data = JSON.parse(window.sessionStorage.getItem(type));
    data.splice(tr.rowIndex-1,1)
    window.sessionStorage.setItem(type,JSON.stringify(data));

    tr.parentNode.removeChild(tr);
    if (data.length == 0){
        document.getElementById(type + "-table").classList.toggle("hidden");
        document.getElementById(type + "-overview-table").classList.toggle("hidden");
    }
        
    updateOverview();

    var table = document.getElementById(type + "-overview-table");
    table.deleteRow(index);
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
    if (window.sessionStorage.getItem("totalData") != null){
        var total = JSON.parse(window.sessionStorage.getItem("totalData"));
    } else 
        var total = [];

    if(total.net > 0){
        var budget = {
            n:name,
            i:income,
            e:expenses,
            s:savings
        }
        
        window.sessionStorage.removeItem("expense");
        window.sessionStorage.removeItem("savings");
        window.sessionStorage.removeItem("income");
        window.sessionStorage.removeItem("totalData");
        window.localStorage.setItem("budget",JSON.stringify(budget));
    } else {
        alert("Cannot Create Budget, Negative Balance");
    }
    
}

function updateOverview(type,index){
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

    var total = {
        iTotal: 0,
        eTotal: 0,
        sTotal: 0,
        net: 0
    };

    income.forEach(e => {
        total.iTotal += e[4];
    });

    expenses.forEach(e => {
        total.eTotal += e[4];
    });

    savings.forEach(e => {
        total.sTotal += e[5];
    });

    total.net = total.iTotal - total.eTotal - total.sTotal;

    window.sessionStorage.setItem("totalData",JSON.stringify(total));

    document.querySelector("#income-overview span").innerHTML = total.iTotal;
    document.querySelector("#expense-overview span").innerHTML = total.eTotal;
    document.querySelector("#savings-overview span").innerHTML = total.sTotal;
    document.querySelector("#balance span").innerHTML = total.net;

    if (total.net < 0)
        document.querySelector("#balance span").style.color = "red";
    else if (total.net > 0)
        document.querySelector("#balance span").style.color = "green";

}

function dateData (date, cost){
    const d = new Date();
    const mm = d.getMonth();
    const yyyy = d.getYear();

    var nDate = new Date(date);
    var diff = ((nDate.getYear()-yyyy)*12) + (nDate.getMonth() - mm)+1;
    var payment = Math.ceil(cost/diff);
    var x = [diff, payment];
    return x;
}

function toggleHidden(btn, id){
    var x = document.getElementById(id);
    var y = btn;
    x.classList.toggle("hidden");
    if (btn.innerHTML == "+")
        btn.innerHTML = "-";
    else
        btn.innerHTML = "+";
}