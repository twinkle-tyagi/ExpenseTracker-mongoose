
/*
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-btn').addEventListener('click', sendData);
    //console.log(document.getElementById('name').value);
    //document.getElementById('login-btn').addEventListener('click', authenticate);
});
*/


//console.log(document.getElementById('name').value);

function sendData(event) {

        event.preventDefault();
        //console.log(document.getElementById('name').value)

    const obj = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    const parent = document.getElementById('response');
    var child = document.createElement('li');

    console.log(obj);

    axios.post('http://3.91.239.252:3000/user/signup', obj)
    .then(result => {
        console.log(result.data.message);
        child.innerText = result.data.message;
        parent.appendChild(child);
    })
    .catch(err => console.log(err));
    /*
    if(response.status === 201) {
        //window.location.href = '../login/login.html';
        console.log("yes");
    }
    else {
        throw new Error('failed');
    }
    */

    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('password').value = ""
    
}

