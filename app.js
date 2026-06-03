const API = "https://kadwal-server.onrender.com";

// Signup
async function signup() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.text();
    alert(data);

  } catch (error) {
    alert("Signup Error");
    console.error(error);
  }
}

// Login
async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.text();
    alert(data);

  } catch (error) {
    alert("Login Error");
    console.error(error);
  }
}

// Add Product
async function addProduct() {

  alert("Button Clicked");

  try {

    const productName =
      document.getElementById("productName").value;

    const productPrice =
      document.getElementById("productPrice").value;

    const res = await fetch(API + "/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productName,
        productPrice
      })
    });

    const data = await res.text();

    alert(data);

  } catch (error) {

    alert("Add Product Error");

    console.error(error);

  }
}
