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
        stock: productStock,
        sellerEmail:
localStorage.getItem("sellerEmail")
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
      
      <p>
Quantity:
${item.quantity || 1}
</p>

<button
onclick="increaseQuantity('${item._id}')">
➕
</button>

<button
onclick="decreaseQuantity('${item._id}')">
➖
</button>

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

  const customerName =
    document.getElementById(
      "customerName"
    ).value;

  const customerPhone =
    document.getElementById(
      "customerPhone"
    ).value;

  const customerAddress =
    document.getElementById(
      "customerAddress"
    ).value;

  const customerCity =
    document.getElementById(
      "customerCity"
    ).value;

  const res = await fetch(
    API + "/checkout",
    {
      method: "POST",

      headers: {
        "Content-Type":
        "application/json"
      },

      body: JSON.stringify({

        customerName,
        customerPhone,
        customerAddress,
        customerCity

      })

    }
  );

  const data =
    await res.text();

  alert(data);

  loadCart();

}
async function payWithStripe() {

  alert("Pay Button Clicked");

  const res = await fetch(
    API + "/create-checkout-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

        productName: "Kadwal Marketplace Order",

        productPrice:
        document
          .getElementById("totalPrice")
          .innerText
          .replace("Total: $","")

      })
    }
  );
  
alert(res.status);
  
  const data =
    await res.json();

  window.location.href =
    data.url;

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
Customer:
${order.customerName || "N/A"}
</p>

<p>
Phone:
${order.customerPhone || "N/A"}
</p>

<p>
Address:
${order.customerAddress || "N/A"}
</p>

<p>
City:
${order.customerCity || "N/A"}
</p>


  <p>

${order.status === "Pending" ?

`🟡 Pending`

:

order.status === "Processing" ?

`🔵 Processing`

:

order.status === "Shipped" ?

`🚚 Shipped`

:

order.status === "Delivered" ?

`✅ Delivered`

:

order.status === "Cancelled" ?

`❌ Cancelled`

:

order.status

}

</p>

<select
id="status-${order._id}">

  <option value="Pending">
    🟡 Pending
  </option>

  <option value="Processing">
    🔵 Processing
  </option>

  <option value="Shipped">
    🚚 Shipped
  </option>

  <option value="Delivered">
    ✅ Delivered
  </option>

  <option value="Cancelled">
    ❌ Cancelled
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
function filterProducts() {


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
    "usersCard"
  ).innerText =
    data.totalUsers;

  document.getElementById(
    "productsCard"
  ).innerText =
    data.totalProducts;

  document.getElementById(
    "ordersCard"
  ).innerText =
    data.totalOrders;

  document.getElementById(
    "revenueCard"
  ).innerText =
    "$" + data.revenue;

}

async function loadNotifications() {

  const res =
    await fetch(
      API + "/notifications"
    );

  const data =
    await res.json();

  const notifications =
    document.getElementById(
      "notifications"
    );
notifications.innerHTML = "";
  
  notifications.innerHTML += `
  <p>
  🛒 Total Orders:
  ${data.totalOrders}
  </p>
`;

  data.lowStock.forEach(
    product => {

      notifications.innerHTML += `
        <p>
        ⚠️ ${product.productName}
        Only ${product.stock}
        Left
        </p>
      `;

    }
  );

}
async function increaseQuantity(id) {

  await fetch(
    API + "/increase-quantity/" + id,
    {
      method: "PUT"
    }
  );

  loadCart();

}

async function decreaseQuantity(id) {

  await fetch(
    API + "/decrease-quantity/" + id,
    {
      method: "PUT"
    }
  );

  loadCart();

}

async function loadTopProducts() {

  const res =
    await fetch(
      API + "/top-products"
    );

  const products =
    await res.json();

  const topProducts =
    document.getElementById(
      "topProducts"
    );

  topProducts.innerHTML = "";

  products.forEach(
    product => {

      topProducts.innerHTML += `
        <p>
        🏆 ${product[0]}
        — ${product[1]} Sales
        </p>
      `;

    }
  );

}
async function loadSalesChart() {

  const res =
    await fetch(
      API + "/sales-chart"
    );

  const data =
    await res.json();

  const labels =
    Object.keys(data);

  const values =
    Object.values(data);

  const ctx =
    document
      .getElementById(
        "salesChart"
      )
      .getContext("2d");

  new Chart(ctx, {

    type: "bar",

    data: {

      labels,

      datasets: [

        {

          label:
          "Sales Revenue",

          data: values

        }

      ]

    }

  });

}

// Send Chat Message
async function sendMessage() {

  const message =
    document.getElementById(
      "chatInput"
    ).value;

  if (!message) {

    alert("Enter Message");

    return;

  }

  const res =
    await fetch(
      API + "/send-message",
      {

        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({

          sender: "Buyer",

          receiver: "Seller",

          productId: "123",

          message

     })

      }
    );

  const data =
    await res.text();

  alert(data);
  
document.getElementById(
  "chatInput"
).value = "";

loadChat();

}
  // Load Chat
async function loadChat() {

  const res =
    await fetch(
      API + "/chat/123"
    );

  const chats =
    await res.json();

  const chatBox =
    document.getElementById(
      "chatMessages"
    );

  chatBox.innerHTML = "";

  chats.forEach(chat => {

    chatBox.innerHTML += `

      <p>
      💬 ${chat.message}
      </p>

    `;

  });

}
async function sellerSignup() {

  const name = document.getElementById("sellerName").value;

  const email = document.getElementById("sellerEmailSignup").value;

  const password = document.getElementById("sellerPasswordSignup").value;

  const phone = document.getElementById("sellerPhone").value;

  const address = document.getElementById("sellerAddress").value;

  const res = await fetch(API + "/seller-signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
      address
    })
  });

  const data = await res.text();

  alert(data);

    }
async function sellerLogin() {

  const email =
    document.getElementById("sellerEmail").value;

  const password =
    document.getElementById("sellerPassword").value;

  try {

    const res = await fetch(
      API + "/seller-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.message === "Login Success") {

      localStorage.setItem(
        "sellerEmail",
        data.seller.email
      );

      document.getElementById(
        "sellerDashboard"
      ).style.display = "block";

      document.getElementById(
        "sellerName"
      ).innerText =
        "Seller: " + data.seller.name;

      document.getElementById(
        "sellerEmailView"
      ).innerText =
        "Email: " + data.seller.email;

      loadSellerProducts();

    }

  } catch (error) {

    console.log(error);
    
    alert(error.message);

  }

}
loadProducts();
loadCart();
loadOrders();
loadWishlist();
loadDashboard();
loadTopProducts();
loadNotifications();
loadSalesChart();
loadChat();

setInterval(loadChat, 2000);

async function loadSellerProducts() {

  const email =
    localStorage.getItem(
      "sellerEmail"
    );

  const res =
    await fetch(

      API +
      "/seller-products/" +
      email

    );

  const products =
    await res.json();

  document.getElementById(
    "sellerProducts"
  ).innerText =
    "Products: " +
    products.length;

    }
