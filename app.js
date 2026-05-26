const API =
"https://kadwal-server.onrender.com";

document
.getElementById("signupBtn")
.addEventListener("click", signup);

async function signup(){

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

const response =
await fetch(`${API}/signup`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})

});

const data =
await response.text();

alert(data);

}
