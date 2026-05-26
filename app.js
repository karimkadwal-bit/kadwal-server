const API = "https://kadwal-server.onrender.com";

async function signup() {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

alert("clicked");

const res = await fetch(API + "/signup", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ email, password })
});

const data = await res.text();

alert(data);

}
