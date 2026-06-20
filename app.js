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

  const data =
  await res.json();

alert(data.message);

if (data.isAdmin) {

  document.getElementById(
    "adminPanel"
  ).style.display = "block";

  loadUsers();

  loadDashboard();
}

}
// Add Product
async function addProduct() {

  const productName =
    document.getElementById("productName").value;

  const productPrice =
    document.getElementById("productPrice").value;

  const productStock =
  document.getElementById("productStock").value;
  
const productCategory =
  document.getElementById("productCategory").value;
  
  const imageFile =
  document.getElementById(
    "productImage"
  ).files[0];
  
const formData =
  new FormData();

formData.append(
  "image",
  imageFile
);
alert("Image Upload Started");
  
  const uploadRes =
  await fetch(
    API + "/upload-image",
    {
      method: "POST",
      body: formData
    }
  );

const uploadData =
  await uploadRes.json();
  alert("Image Uploaded");
  const productImage =
  API + uploadData.imageUrl;
  
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
        productCategory,
        productImage,
        stock: productStock
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

  loadCart();

}

// Add To Wishlist
async function addToWishlist(product) {

  const res = await fetch(
    API + "/add-to-wishlist",
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
        productCategory: product.productCategory,
        productImage: product.productImage
      })

    }
  );

  const data =
    await res.text();

  alert(data);
loadWishlist();
      }

// Rate Product
async function rateProduct(id) {

  const rating =
    document.getElementById(
      `rating-${id}`
    ).value;

  const res = await fetch(
    API + "/rate-product/" + id,
    {
      method: "POST",
      headers: {
        "Content-Type":
        "application/json"
      },
      body: JSON.stringify({
        rating
      })
    }
  );

  const data =
    await res.text();

  alert(data);

  loadProducts();

}

// Add Review
async function addReview(id) {

  alert("Review Button Clicked");

  const review =
    document.getElementById(
      `review-${id}`
    ).value;

  const res = await fetch(
    API + "/add-review/" + id,
    {
      method: "POST",
      headers: {
        "Content-Type":
        "application/json"
      },
      body: JSON.stringify({
        review
      })
    }
  );

  const data =
    await res.text();

  alert(data);

  loadProducts();

        }

// Update Order Status
async function updateOrderStatus(id) {

  const status =
    document.getElementById(
      `status-${id}`
    ).value;

  const res = await fetch(
    API + "/update-order-status/" + id,
    {
      method: "PUT",

      headers: {
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({
        status
      })

    }
  );

  const data =
    await res.text();

  alert(data);

  loadOrders();

}
// Remove From Cart
async function removeFromCart(id) {

  const res = await fetch(
    API + "/remove-from-cart/" + id,
    {
      method: "DELETE"
    }
  );

  const data =
    await res.text();

  alert(data);

  loadCart();

}
async function removeFromWishlist(id) {

  const res = await fetch(
    API + "/remove-from-wishlist/" + id,
    {
      method: "DELETE"
    }
  );

  const data =
    await res.text();

  alert(data);

  loadWishlist();

      }
// Load Cart
async function loadCart() {

  const res =
    await fetch(API + "/cart");

  const cartItems =
    await res.json();

  const cartList =
    document.getElementById("cartList");

  if (!cartList) return;

  cartList.innerHTML = "";
let total = 0;
  cartItems.forEach(item => {
total += Number(item.productPrice);
    cartList.innerHTML += `

    <div class="product-card">

      <img
      src="${item.productImage}"
      style="
      width:100%;
      max-height:200px;
      object-fit:cover;
      border-radius:10px;
      ">

      <h3>${item.productName}</h3>

      <p>
      Price: $${item.productPrice}
      </p>

      <button
      onclick="removeFromCart('${item._id}')">
      Remove From Cart
      </button>

    </div>

    `;

  });

document.getElementById(
  "totalPrice"
).innerText =
  "Total: $" + total;
}
// Load Products
async function loadProducts() {

  const res =
    await fetch(API + "/products");

  const products =
    await res.json();

  const productsList =
    document.getElementById(
      "productsList"
    );

  productsList.innerHTML = "";

  products.forEach(product => {

    productsList.innerHTML += `

    <div
class="product-card"
data-category="${product.productCategory}">

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
Category:
${product.productCategory}
</p>

      <p>
      Price:
      $${product.productPrice}
      </p>
      <p>
      
<p>
Stock:
${product.stock}
</p>

${product.stock === 0 ?

`<p style="color:red;">
❌ Out Of Stock
</p>`

:

product.stock <= 5 ?

`<p style="color:orange;">
⚠️ Only ${product.stock} Left
</p>`

:

`<p style="color:green;">
✅ In Stock
</p>`

}

 <p>
 Reviews:
 ${product.reviews ?
 product.reviews.join(",")
 : ""}
 </p>
     
      <p>
Rating:
${product.rating || 0} ⭐
</p>

<select
id="rating-${product._id}">
  <option value="1">⭐</option>
  <option value="2">⭐⭐</option>
  <option value="3">⭐⭐⭐</option>
  <option value="4">⭐⭐⭐⭐</option>
  <option value="5">⭐⭐⭐⭐⭐</option>
</select>

<button
onclick="rateProduct('${product._id}')">
Rate
</button>

<input
id="review-${product._id}"
placeholder="Write Review">

<button
onclick="addReview('${product._id}')">
Add Review
</button>

      ${product.stock > 0 ? `

<button
onclick='addToCart(${JSON.stringify(product)})'>
Add To Cart
</button>

` : `

<button disabled>
Out Of Stock
</button>

`}

      <button
onclick='addToWishlist(${JSON.stringify(product)})'>
❤️ Wishlist
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
// Checkout
async function checkout() {

  const res = await fetch(
    API + "/checkout",
    {
      method: "POST"
    }
  );

  const data =
    await res.text();

  alert(data);

  loadCart();

}
// Load Orders
async function loadOrders() {

  const res =
    await fetch(API + "/orders");

  const orders =
    await res.json();

  const ordersList =
    document.getElementById("ordersList");

  if (!ordersList) return;

  ordersList.innerHTML = "";

  orders.forEach(order => {

    ordersList.innerHTML += `

    <div class="product-card">

      <img
      src="${order.productImage}"
      style="
      width:100%;
      max-height:200px;
      object-fit:cover;
      border-radius:10px;
      ">

      <h3>${order.productName}</h3>

      <p>
      Price: $${order.productPrice}
      </p>

  <p>
Status:
${order.status}
</p>

<select
id="status-${order._id}">
  <option value="Pending">
    Pending
  </option>

  <option value="Shipped">
    Shipped
  </option>

  <option value="Delivered">
    Delivered
  </option>
</select>

<button
onclick="updateOrderStatus('${order._id}')">
Update Status
</button>
</div>

`;

  });

}

// Load Wishlist
async function loadWishlist() {

  const res =
    await fetch(API + "/wishlist");

  const wishlist =
    await res.json();

  const wishlistList =
    document.getElementById(
      "wishlistList"
    );

  if (!wishlistList) return;

  wishlistList.innerHTML = "";

  wishlist.forEach(item => {

    wishlistList.innerHTML += `

    <div class="product-card">

      <img
      src="${item.productImage}"
      style="
      width:100%;
      max-height:200px;
      object-fit:cover;
      border-radius:10px;
      ">

      <h3>
      ${item.productName}
      </h3>

      <p>
      Price:
      $${item.productPrice}
      </p>
      
      <button
onclick="removeFromWishlist('${item._id}')">
Remove Wishlist
</button>

    </div>

    `;

  });

}

// Load Users
async function loadUsers() {

  alert("Loading Users");
  
  const res =
    await fetch(API + "/users");

  const users =
    await res.json();

  const usersList =
    document.getElementById(
      "usersList"
    );

  if (!usersList) return;

  usersList.innerHTML = "";

  users.forEach(user => {

    usersList.innerHTML += `

    <div class="product-card">

      <h3>
      ${user.email}
      </h3>

      <button
      onclick="deleteUser('${user._id}')">
      Delete User
      </button>

    </div>

    `;

  });

}

// Delete User
async function deleteUser(id) {

  const res = await fetch(
    API + "/delete-user/" + id,
    {
      method: "DELETE"
    }
  );

  const data =
    await res.text();

  alert(data);

  loadUsers();

}

// Search Products
async function searchProducts() {

  const search =
    document.getElementById(
      "searchInput"
    ).value.toLowerCase();

  const cards =
    document.querySelectorAll(
      ".product-card"
    );

  cards.forEach(card => {

    const name =
      card.querySelector("h3")
      .innerText
      .toLowerCase();

    if (
      name.includes(search)
    ) {

      card.style.display =
        "block";

    } else {

      card.style.display =
        "none";

    }

  });

}
async function filterProducts() {

  const selected =
    document.getElementById(
      "filterCategory"
    ).value;

  const cards =
    document.querySelectorAll(
      ".product-card"
    );

  cards.forEach(card => {

    const category =
      card.getAttribute(
        "data-category"
      );

    if (
      selected === "All" ||
      category === selected
    ) {

      card.style.display =
        "block";

    } else {

      card.style.display =
        "none";

    }

  });

}

async function loadDashboard() {

  const res =
    await fetch(
      API + "/dashboard-stats"
    );

  const data =
    await res.json();

  document.getElementById(
    "totalUsers"
  ).innerText =
    "Users: " +
    data.totalUsers;

  document.getElementById(
    "totalProducts"
  ).innerText =
    "Products: " +
    data.totalProducts;

  document.getElementById(
    "totalOrders"
  ).innerText =
    "Orders: " +
    data.totalOrders;

  document.getElementById(
    "revenue"
  ).innerText =
    "Revenue: $" +
    data.revenue;

}

loadProducts();
loadCart();
loadOrders();
loadWishlist();
