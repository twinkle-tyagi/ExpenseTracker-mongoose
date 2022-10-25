/*
window.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('login-btn').addEventListener('click', authenticate);
    //console.log(document.getElementById('login-btn'));
});
*/

//const { default: axios } = require("axios");


function authenticate(event) {
    event.preventDefault();

    const obj = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    }
    console.log("obj =", obj);

    const parent = document.getElementById('response');
    var child = document.createElement('li');

    axios.post('http://3.91.239.252:3001/user/authenticate', obj)
    .then(result => {
        console.log("yes");
        //console.log(result);
        child.innerText = result.data.message;
        parent.appendChild(child);
        
        console.log(result);
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('isPremium', JSON.stringify(result.data.isPremium));
        

        window.location.href = "./expense.html";
    })
    .catch(err => console.log(err));
    //console.log(result.respose);

    document.getElementById('login-email').value = "";
    document.getElementById('login-password').value = ""

}

function forgotPwd() {
    const email = document.getElementById('enter-email');
    email.style.display = "block";
    document.getElementById('forget-btn-submit').style.display = "block";
}

function forgotPassword() {
    const email = document.getElementById('enter-email').value;
    console.log(email);
    axios.post('http://3.91.239.252:3001/called/password/forgotpassword', {email: email})
    .then(password => {
        console.log(password);
    })
    .catch(err => console.log(err));
}