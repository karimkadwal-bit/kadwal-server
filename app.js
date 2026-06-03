const API = "https://kadwal-server.onrender.com";

// Signup
async function signup() {

  const email =
  document.getElementById("email").value;

  const password =
  document.getElementById("password").value;

  const res = await fetch(API + "/signup", {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.text();

  alert(data);

}

// Login
async function login() {

  const email =
  document.getElementById("email").value;

  const password =
  document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.text();

  alert(data);

}

// Add Product
async function addProduct() {

  const productName =
  document.getElementById("productName").value;

  const productPrice =
  document.getElementById("productPrice").value;

  const res = await fetch(API + "/add-product", {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      productName,
      productPrice
    })
  });

  const data = await res.text();

  alert(data);

  loadProducts();

}

// Load Products
async function loadProducts() {

  const res =
  await fetch(API + "/products");

  const products =
  await res.json();

  const productsList =
  document.getElementById("productsList");

  productsList.innerHTML = "";

  products.forEach(product => {

    productsList.innerHTML += `
    <div class="product-card">
      <h3>${product.productName}</h3>
      <p>Price: $${product.productPrice}</p>
    </div>
    `;

  });

}

loadProducts();
