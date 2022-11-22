
const token = localStorage.getItem('token');

var premium = 0;

const choice = document.getElementById('item-per-page');
//console.log("choice is", choice);
choice.addEventListener('change', () => {
    localStorage.setItem('choice', choice.value);
})

const ITEMS_PER_PAGE = localStorage.getItem('choice');
console.log("items", ITEMS_PER_PAGE);

document.getElementById('item-per-page').value = ITEMS_PER_PAGE;

function expenses (e) {
    e.preventDefault();

    console.log("token in local storage" , token);
    
    var obj = {
        expense: document.getElementById('expense').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
    }

    console.log(obj);

    axios.post('http://localhost:3000/expense/addExpenses', obj, {headers: {Authorization: token}})
    .then(result => {
        addToPage(obj);
    })
    .catch(err => console.log(err));
}

function addToPage(obj) {

    const parent = document.getElementById('add-expense');

    console.log("obj.id ", obj)

    const child = document.createElement('li');

    const node = `<li id = "${obj._id}">  
    <span> Expenses = "${obj.expense}" </span>
    <span> Description = "${obj.description}" </span>
    <span> Category = "${obj.category} "</span>
    <button type="button" onclick =  "" > Edit </button>
    <button type="button" onclick = "deleteExpense('${obj._id}')"> Delete </button>
    </li> `

    child.innerHTML = node;

    parent.appendChild(child);
}

function deleteExpense(id) {

    const token = localStorage.getItem('token');
    console.log(token, id)

    axios.delete(`http://localhost:3000/expense/deleteExpense/${id}`, {headers: {Authorization: token}})
    .then(result => {
        deleteFromPage(id);
    })
    .catch(err => console.log(err));
}

function deleteFromPage(id) {
    ///const parent = document.getElementById('add-expense');
    const child = document.getElementById(id);
    //parent.removeChild(child);
    child.remove();
}

function createOrder() {
    var x =0;
    axios.post('http://localhost:3000/order/createOrder', x, {headers: {Authorization: token}})
    .then(order => {
        console.log("order data", order);
        //localStorage.setItem("order", JSON.stringify(order.data));

        console.log("data is", order.data);
        checkout(order.data);

        //window.location.href = "checkout.html";
    })
    .catch(err => console.log(err));
}

function checkout(order) {
    //event.preventDefault();

    console.log("in checkout", order.order.id);

    //const order = JSON.parse(localStorage.getItem('order'));

    //console.log(order.id);

    var options = {
        "key" : order.order.key_id,
        "amount": order.order.amount,
        "currency": "INR",
        "order_id": order.order.id,
        "handler": function (response) {
            //alert(response.razorpay_payment_id);
            //alert(response.razorpay_order_id);
            //alert(response.razorpay_signature);
            //console.log(response);
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_order_id);
            console.log(response.razorpay_signature);

            //order_id = order.id;

            axios.post('http://localhost:3000/order/payment', response, {headers: {Authorization: token}})
            .then(res => {
                console.log("done");
                console.log(res);
                alert("You are a premium user now");
                premium = 1;
                localStorage.setItem('isPremium', true);
                premiumUser();
            })
            .catch(err => console.log(err));

        },
        "theme": {
            "color": "#cc0000",
        },

        "callback_url": "expense.html"
    }

    var razorpay_1 = new Razorpay(options);
    
    razorpay_1.on('payment_failed', function(res) {
        alert(res.error.code);
        alert(res.error.description);
    });

    razorpay_1.open();
}

function premiumUser() {
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = "grey";
    body.style.color = "white";
    document.getElementById('premium-btn').style.display = "none";
    document.getElementById('download-btn').style.display = "block";
}

function download() {
    axios.get('http://localhost:3000/user/download', {headers: {Authorization: token}})
    .then(response => {
        if(response.status === 200) {
            var a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'userExpense.csv';
            a.click();  //simulates mouse click
        }
        else {
            throw new Error(response.data.message);
        }
    })
    .catch(err => console.log(err));
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const isPremium = localStorage.getItem('isPremium');

    console.log(isPremium);
    console.log("in DOMLOaded", token);

    if(isPremium == "true") {
        //alert("premium");
        premiumUser();
        leaderBoard();
    }
/*
    axios.get('http://localhost:3000/expense/filesDownloaded', {headers: {Authorization: token}})
    .then(url =>  {
        console.log("this is url");
    }).catch(err => console.log(err));
*/

    const page=1;

    axios.get(`http://localhost:3000/?page=${page}`, {headers: {Authorization: token, ITEMS_PER_PAGE: ITEMS_PER_PAGE}})
    .then(result => {
        //console.log("here I am", result);
        //console.log("pagination " ,result);
        pagination(result);
        for(var i =0; i< result.data.expenses.length; i++) {
            addToPage(result.data.expenses[i]);
        }
    })
    .catch(err => console.log(err));
})


function pagination(res) {
    var currentPage = res.data.currentPage;
    var nextPage = res.data.nextPage;
    var previousPage = res.data.previousPage;

    console.log(">>>>>>>>>.",nextPage);

    const pagibtn = document.getElementById('pagination');
    pagibtn.innerHTML = "";
    const pagiData = document.getElementById('add-expense');
    pagiData.innerHTML = "";
    
    if(res.data.hasPreviousPage) {
        const btn1 = document.createElement('button');
        btn1.innerHTML = previousPage;
        btn1.addEventListener('click', () => getExpense(previousPage));
        pagibtn.append(btn1);
    }

    const btn2 = document.createElement('button');
    btn2.innerHTML = currentPage;
    btn2.addEventListener('click', () => getExpense(currentPage));
    pagibtn.append(btn2);

    if(res.data.hasNextPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => getExpense(nextPage));
        pagibtn.append(btn3);
    }
}

async function getExpense(Page) {
    document.getElementById('add-expense').innerHTML = "";
    var res = await axios.get(`http://localhost:3000/?page=${Page}`, {headers: {Authorization: token, ITEMS_PER_PAGE: ITEMS_PER_PAGE}});
    pagination(res);
    for(var i =0; i<res.data.expenses.length; i++){
        addToPage(res.data.expenses[i]);
    }
}


function leaderBoard() {
    axios.get('http://localhost:3000/expense/getLeaderBoard')
    .then(users => {
        console.log("hey", users.data);
        for(var i =0; i<users.data.length; i++) {
            showAllUsers(users.data[i]);
        }
    })
    .catch(err => console.log(err));
}


function showAllUsers(user) {
    console.log("users are", user[0].userId);

    const parent = document.getElementById('leaderboard');

    const child = document.createElement('li');

    const len = user.length;

    for(var i =0; i<user.length-1; i++){
        const node = `<li>
        <span> ${user[len-1]} </span> 
        <span>${user[i].expense} </span>
    <span>${user[i].description} </span>
    <span>${user[i].category} </span>
    </li>`

    child.innerHTML = child.innerHTML + node;
    }
    parent.appendChild(child);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isPremium');
    window.location.href = 'login.html';
}