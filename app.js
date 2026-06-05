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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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

  const productImage =
    document.getElementById("productImage").value;

  const res = await fetch(
    API + "/add-product",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        productName,
        productPrice,
        productImage
      })
    }
  );

  const data =
    await res.text();

  alert(data);

  loadProducts();

}

// Delete Product
async function deleteProduct(id) {

  const res = await fetch(
    API + "/delete-product/" + id,
    {
      method: "DELETE"
    }
  );

  const data =
    await res.text();

  alert(data);

  loadProducts();

}
// Add To Cart
async function addToCart(product) {

  const res = await fetch(
    API + "/add-to-cart",
    {
      method: "POST",

      headers: {
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({
        productId: product._id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage
      })

    }
  );

  const data =
  await res.text();

  alert(data);

}
// Edit Product
async function editProduct(id) {

  const productName =
    prompt("New Product Name");

  if (!productName) return;

  const productPrice =
    prompt("New Product Price");

  if (!productPrice) return;

  const productImage =
    prompt("New Product Image URL");

  if (!productImage) return;

  const res = await fetch(
    API + "/edit-product/" + id,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        productName,
        productPrice,
        productImage
      })

    }
  );

  const data =
    await res.text();

  alert(data);

  loadProducts();

}

// Load Products
async function loadProducts() {

  const res =
    await fetch(
      API + "/products"
    );

  const products =
    await res.json();

  const productsList =
    document.getElementById(
      "productsList"
    );

  productsList.innerHTML = "";

  products.forEach(product => {

    productsList.innerHTML += `

    <div class="product-card">

      <img
      src="${product.productImage}"
      alt="${product.productName}"
      style="
      width:100%;
      max-height:250px;
      object-fit:cover;
      border-radius:10px;
      ">

      <h3>
      ${product.productName}
      </h3>

      <p>
      Price:
      $${product.productPrice}
      </p>
<button
onclick='addToCart(${JSON.stringify(product)})'>
Add To Cart
</button>
      <button
      onclick="editProduct('${product._id}')">
      Edit Product
      </button>

      <button
      onclick="deleteProduct('${product._id}')">
      Delete Product
      </button>

    </div>

    `;

  });

}

loadProducts();
