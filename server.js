const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const Stripe = require("stripe");

const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://karim:karim455345@cluster0.70ffkmb.mongodb.net/kadwalMarketplace?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );

  }

});

const upload = multer({
  storage
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
    
  isAdmin: {
    type: Boolean,
    default: false
}
});

const User = mongoose.model("User", UserSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  productName: String,
  productPrice: String,
  productCategory: String,
  productImage: String,
  sellerEmail: String,
  
  stock: {
  type: Number,
  default: 0
},
  
  rating:  {
    type:Number,
    default: 0
  },

  reviews: {
    type: [String],
    default: []
  }
});

const Product = mongoose.model("Product", ProductSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  productPrice: String,
  productImage: String,
  sellerEmail: String,
  
quantity: {
    type: Number,
    default: 1
  }
});
const Cart = mongoose.model("Cart", CartSchema);
const OrderSchema = new mongoose.Schema({
productName: String,
productPrice: String,
productImage: String,
  sellerEmail: String,

  customerName: String,
customerPhone: String,
customerAddress: String,
customerCity: String,


status: {
type: String,
default: "Pending"
},


orderDate: {
type: Date,
default: Date.now
}
});


const Order = mongoose.model(
"Order",
OrderSchema
);



// Wishlist Schema
const WishlistSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  productPrice: String,
  productCategory: String,
  productImage: String
});

const Wishlist = mongoose.model(
  "Wishlist",
  WishlistSchema
);
const SellerSchema = new mongoose.Schema({

  name: String,

  email: String,

  password: String,

  phone: String,

  address: String,

  online: {
  type: Boolean,
  default: false
},

lastSeen: {
  type: Date,
  default: Date.now
},

  createdAt: {

    type: Date,

    default: Date.now

  }

});

const Seller = mongoose.model(
  "Seller",
  SellerSchema
);
// Chat Schema
const ChatSchema = new mongoose.Schema({

  sellerEmail: String,

  customerName: String,

  message: String,

  voice: String,

  image: {
  type: String,
  default: ""
},

  sender: String,

  seen: {
  type: Boolean,
  default: false
},

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Chat = mongoose.model("Chat", ChatSchema);

const ReviewSchema = new mongoose.Schema({

  sellerEmail: {
    type: String,
    required: true
  },

  customerName: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comment: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Review = mongoose.model("Review", ReviewSchema);
// ===============================
// CREATE REVIEW
// ===============================

const NotificationSchema = new mongoose.Schema({

  sellerEmail: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: "Order"
  },

  orderId: {
    type: String,
    default: ""
  },

  seen: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Notification =
  mongoose.model("Notification", NotificationSchema);

app.post("/add-review", async (req, res) => {

  try {

    const {
      sellerEmail,
      customerName,
      rating,
      comment
    } = req.body;

    if (!sellerEmail || !customerName || !rating) {
      return res.status(400).send("Missing review information");
    }

    const review = new Review({

      sellerEmail,
      customerName,
      rating: Number(rating),
      comment: comment || ""

    });

    await review.save();

    res.send("Review Added Successfully");

  } catch (error) {

    console.log(error);

    res.status(500).send("Failed to add review");

  }

});


// ===============================
// GET SELLER REVIEWS
// ===============================

app.get("/seller-reviews/:email", async (req, res) => {

  try {

    const reviews = await Review.find({

      sellerEmail: req.params.email

    }).sort({
      createdAt: -1
    });

    res.json(reviews);

  } catch (error) {

    console.log(error);

    res.status(500).send("Failed");

  }

});


// ===============================
// GET SELLER RATING
// ===============================

app.get("/seller-rating/:email", async (req, res) => {

  try {

    const reviews = await Review.find({

      sellerEmail: req.params.email

    });

    if (reviews.length === 0) {

      return res.json({

        averageRating: 0,
        totalReviews: 0

      });

    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      total / reviews.length;

    res.json({

      averageRating:
        Number(averageRating.toFixed(1)),

      totalReviews:
        reviews.length

    });

  } catch (error) {

    console.log(error);

    res.status(500).send("Failed");

  }

});
// Home
app.get("/", (req, res) => {
  res.send("Kadwal Marketplace API Running");
});

// Add To Wishlist
app.post("/add-to-wishlist", async (req, res) => {

  try {

    const wishlistItem =
      new Wishlist(req.body);

    await wishlistItem.save();

    res.send(
      "Added To Wishlist"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Add Wishlist"
    );

  }

});

// Signup
app.post("/signup", async (req, res) => {

  try {

    const { email, password } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.send("User Already Exists");
    }

    const hashedPassword =
  await bcrypt.hash(
    password,
    10
  );

const user = new User({
  email,
  password: hashedPassword
});

    await user.save();

    res.send("Signup Successful");

  } catch (error) {

    console.log(error);

    res.status(500).send("Signup Failed");

  }

});
// login
app.post("/login", async (req, res) => {


try {


const { email, password } = req.body;

const user =
  await User.findOne({
    email
  });

if (!user) {

  return res.json({
    message:
    "Invalid Email Or Password",
    isAdmin: false
  });

}

const match =
  await bcrypt.compare(
    password,
    user.password
  );

if (!match) {

  return res.json({
  message: "Login Successful",
  isAdmin: false,
  email: user.email
});

}

if (user.isAdmin) {

  return res.json({
    message:
    "Admin Login Success",
    isAdmin: true
  });

}

return res.json({
  message:
  "Login Successful",
  isAdmin: false
});



} catch (error) {


console.log(error);

res.status(500).json({
  message:
  "Login Failed"
});



}


});



// Add Product
app.post("/add-product", async (req, res) => {

  try {

    const {
      productName,
      productPrice,
      productCategory,
      productImage,
      stock,
      sellerEmail
    } = req.body;

    const product = new Product({
      productName,
      productPrice,
      productCategory,
      productImage,
      stock,
      sellerEmail
    });

    await product.save();

    res.send("Product Added Successfully");

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Add Product"
    );

  }

});

// Get Products
app.get("/products", async (req, res) => {

  try {

    const products =
      await Product.find();

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Load Products"
    );

  }

});

// Delete Product
app.delete("/delete-product/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.send(
      "Product Deleted Successfully"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Delete Product"
    );

  }

});
app.get(
  "/seller-products/:email",
  async (req, res) => {

    try {

      const products =
        await Product.find({

          sellerEmail:
            req.params.email

        });

      res.json(products);

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
// Edit Product
app.put("/edit-product/:id", async (req, res) => {

  try {

    const {
      productName,
      productPrice,
      productImage
    } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        productPrice,
        productImage
      }
    );

    res.send(
      "Product Updated Successfully"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Update Product"
    );

  }

});

// Add To Cart
app.post("/add-to-cart", async (req, res) => {

  try {

    const {
      productId,
      productName,
      productPrice,
      productImage,
      sellerEmail  
    } = req.body;

    const existingCartItem =
  await Cart.findOne({
    productId
  });

if (existingCartItem) {

  existingCartItem.quantity += 1;

  await existingCartItem.save();

  return res.send(
    "Quantity Updated"
  );

}
    const cartItem = new Cart({
      productId,
      productName,
      productPrice,
      productImage,
      sellerEmail
    });

    await cartItem.save();

    res.send("Added To Cart");

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Add To Cart"
    );

  }

});

// Get Cart
app.get("/cart", async (req, res) => {

  try {

    const cartItems =
      await Cart.find();

    res.json(cartItems);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Load Cart"
    );

  }

});
// Remove From Cart
app.delete("/remove-from-cart/:id", async (req, res) => {

  try {

    await Cart.findByIdAndDelete(
      req.params.id
    );

    res.send(
      "Removed From Cart"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Remove From Cart"
    );

  }

});
// Checkout
app.post("/checkout", async (req, res) => {


try {

  const {
  customerName,
  customerPhone,
  customerAddress,
  customerCity
} = req.body;

const cartItems =
  await Cart.find();

for (const item of cartItems) {
  
  console.log("Item:", item);
console.log("ProductId:", item.productId);

  const product =
    await Product.findById(
      item.productId
    );

  if (product) {

    product.stock =
      Math.max(
        0,
        product.stock - 
        (item.quantity || 1)
      );

    await product.save();

  }

  const order =
    new Order({
      productName: item.productName,
      productPrice: item.productPrice,
      productImage: item.productImage,

      customerName,
    customerPhone,
    customerAddress,
    customerCity
      
    });

  await order.save();

}

await Cart.deleteMany({});

res.send(
  "Order Placed Successfully"
);



} catch (error) {


console.log(error);

res.status(500).send(
  "Checkout Failed"
);



}


});


// Get Orders
app.get("/orders", async (req, res) => {

  try {

    const orders =
      await Order.find();

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Load Orders"
    );

  }

});

// Update Order Status
app.put(
  "/update-order-status/:id",
  async (req, res) => {

    try {

      const { status } =
        req.body;

      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status
        }
      );

      res.send(
        "Order Status Updated"
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed To Update Status"
      );

    }

  }
);

// Get Wishlist
app.get("/wishlist", async (req, res) => {

  try {

    const wishlist =
      await Wishlist.find();

    res.json(wishlist);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Load Wishlist"
    );

  }

});

// Get Users
app.get("/users", async (req, res) => {

  try {

    const users =
      await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).send(
      "Failed To Load Users"
    );

  }

});

// Delete User
app.delete("/delete-user/:id", async (req, res) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.send(
      "User Deleted"
    );

  } catch (error) {

    res.status(500).send(
      "Delete Failed"
    );

  }

});

// Dashboard Stats
app.get("/dashboard-stats", async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    const orders =
      await Order.find();

    let revenue = 0;

    orders.forEach(order => {

      revenue += Number(
        order.productPrice
      );

    });

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      revenue
    });

  } catch (error) {

    res.status(500).send(
      "Failed To Load Stats"
    );

  }

});

// Rate Product
app.post("/rate-product/:id", async (req, res) => {

  try {

    const { rating } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      { rating }
    );

    res.send(
      "Product Rated"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Rate Product"
    );

  }

});
app.delete(
  "/remove-from-wishlist/:id",
  async (req, res) => {

    try {

      await Wishlist.findByIdAndDelete(
        req.params.id
      );

      res.send(
        "Removed From Wishlist"
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed To Remove Wishlist"
      );

    }

  }
);

// Add Review
app.post("/add-review/:id", async (req, res) => {

  try {

    const { review } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: review
        }
      }
    );

    res.send(
      "Review Added"
    );

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Failed To Add Review"
    );

  }

});

app.use(
  "/uploads",
  express.static("uploads")
);

// Upload Image
app.post(
  "/upload-image",
  upload.single("image"),
  (req, res) => {

    res.json({
      imageUrl:
        "/uploads/" +
        req.file.filename
    });

  }
);
app.put(
  "/increase-quantity/:id",
  async (req, res) => {

    try {

      const item =
        await Cart.findById(
          req.params.id
        );

      item.quantity += 1;

      await item.save();

      res.send(
        "Quantity Increased"
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.put(
  "/decrease-quantity/:id",
  async (req, res) => {

    try {
      console.log(
  "Increase ID:",
  req.params.id
);

      const item =
        await Cart.findById(
          req.params.id
        );

      if (
        item.quantity > 1
      ) {

        item.quantity -= 1;

        await item.save();

      }

      res.send(
        "Quantity Decreased"
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.get(
  "/top-products",
  async (req, res) => {

    try {

      const orders =
        await Order.find();

      const sales = {};

      orders.forEach(order => {

        if (
          sales[
            order.productName
          ]
        ) {

          sales[
            order.productName
          ]++;

        } else {

          sales[
            order.productName
          ] = 1;

        }

      });

      const topProducts =
        Object.entries(sales)
          .sort(
            (a, b) =>
              b[1] - a[1]
          )
          .slice(0, 5);

      res.json(
        topProducts
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.get(
  "/notifications",
  async (req, res) => {

    try {

      const lowStock =
        await Product.find({
          stock: {
            $lte: 5
          }
        });

      const totalOrders =
        await Order.countDocuments();

      res.json({
        lowStock,
        totalOrders
      });

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.get(
  "/sales-chart",
  async (req, res) => {

    try {

      const orders =
        await Order.find();

      const chartData = {};

      orders.forEach(order => {

        const date =
          new Date(order.orderDate);

        const month =
          date.toLocaleString(
            "en-US",
            {
              month: "short"
            }
          );

        if (!chartData[month]) {

          chartData[month] = 0;

        }

        chartData[month] +=
          Number(order.productPrice);

      });

      res.json(chartData);

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.post(
  "/create-checkout-session",
  async (req, res) => {

    try {

      const {
        productName,
        productPrice
      } = req.body;

      const session =
        await stripe.checkout.sessions.create({

          payment_method_types: [
            "card"
          ],

          line_items: [

            {

              price_data: {

                currency: "usd",

                product_data: {

                  name: productName

                },

                unit_amount:
                  Number(productPrice) * 100

              },

              quantity: 1

            }

          ],

          mode: "payment",

          success_url:
"https://karimkadwal-bit.github.io",

cancel_url:
"https://karimkadwal-bit.github.io",

        });

      res.json({

        url: session.url

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: error.message
  });


    }

  }
);
app.post(
  "/send-message",
  async (req, res) => {

    try {

      const {

  sender,

  receiver,

  productId,

  message

} = req.body;

      const chat =
        new Chat({

         sender,

         receiver,

         productId,

         message

});

      await chat.save();

      res.send(
        "Message Sent"
      );

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

        }

  }
);
// Load Chat Messages
app.get(
  "/chat/:productId",
  async (req, res) => {

    try {

      const chats =
        await Chat.find({

          productId:
            req.params.productId

        }).sort({

          createdAt: 1

        });

      res.json(chats);

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.post(
  "/seller-signup",
  async (req, res) => {

    try {

      const {

        name,

        email,

        password,

        phone,

        address

      } = req.body;

      const hash =
        await bcrypt.hash(password, 10);

      const seller =
        new Seller({

          name,

          email,

          password: hash,

          phone,

          address

        });

      await seller.save();

      console.log("Seller Saved:", seller);

      res.send("Seller Registered");

    } catch (error) {

      console.log(error);

      res.status(500).send("Failed");

    }

  }
);
app.post(
  "/seller-login",
  async (req, res) => {

    try {

      console.log(req.body);

      const {

        email,

        password

      } = req.body;
      
console.log("LOGIN EMAIL:", email);

const seller = await Seller.findOne({ email });

console.log("SELLER:", seller);

      if (!seller) {

        return res.json({
          message: "Seller Not Found"
        });

      }

      const match =
        await bcrypt.compare(

          password,

          seller.password

        );

      if (!match) {

        return res.json({
          message: "Wrong Password"
        });

      }

      seller.online = true;
seller.lastSeen = new Date();

await seller.save();

      res.json({

        message: "Login Success",

        seller

      });

    } catch (error) {

      console.log(error);

      res.status(500).send(
        "Failed"
      );

    }

  }
);
app.post("/seller-logout", async (req, res) => {

  try {

    const { email } = req.body;

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.send("Seller Not Found");
    }

    seller.online = false;
    seller.lastSeen = new Date();

    await seller.save();

    res.send("Logout Success");

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-products/:email", async (req, res) => {

  try {

    const products = await Product.find({
      sellerEmail: req.params.email
    });

    res.json(products);

  } catch (err) {

    res.status(500).send("Failed");

  }

});
app.delete("/delete-product/:id", async (req, res) => {

  try {

    await Product.findByIdAndDelete(req.params.id);

    res.send("Product Deleted");

  } catch (err) {

    console.log(err);

    res.status(500).send("Delete Failed");

  }

});

app.put("/edit-product/:id", async (req, res) => {

  try {

    const {
      productName,
      productPrice,
      productCategory,
      stock
    } = req.body;

    await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        productPrice,
        productCategory,
        stock
      }
    );

    res.send("Product Updated");

  } catch (err) {

    console.log(err);

    res.status(500).send("Update Failed");

  }

});
app.get("/seller-orders/:email", async (req, res) => {

  try {

    const orders = await Order.find({
      sellerEmail: req.params.email
    });

    res.json(orders);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.put("/update-order-status/:id", async (req, res) => {

  try {

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      }
    );

    res.send("Status Updated");

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-sales-chart/:email", async (req, res) => {

  try {

    const products = await Product.find({
      sellerEmail: req.params.email
    });

    const labels = [];
    const values = [];

    products.forEach(product => {

      labels.push(product.productName);
      values.push(Number(product.productPrice));

    });

    res.json({
      labels,
      values
    });

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-notifications/:email", async (req, res) => {

  try {

    const orders = await Order.find({
      sellerEmail: req.params.email
    });

    const notifications = [];

    orders.forEach(order => {

      notifications.push(
        "🛒 New Order: " + order.productName
      );

    });

    res.json(notifications);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-wallet/:email", async (req, res) => {

  try {

    const orders = await Order.find({
      sellerEmail: req.params.email
    });

    let available = 0;
    let pending = 0;

    orders.forEach(order => {

      if (order.status === "Delivered") {

        available += Number(order.productPrice);

      } else {

        pending += Number(order.productPrice);

      }

    });

    res.json({
      available,
      pending
    });

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-transactions/:email", async (req, res) => {

  try {

    const orders = await Order.find({
      sellerEmail: req.params.email
    });

    res.json(orders);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-analytics/:email", async (req, res) => {

  try {

    const orders = await Order.find({
      sellerEmail: req.params.email,
      status: "Delivered"
    });

    let total = 0;

    orders.forEach(order => {

      total += Number(order.productPrice);

    });

    res.json({

      today: total,

      week: total,

      month: total,

      year: total

    });

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-low-stock/:email", async (req, res) => {

  try {

    const products = await Product.find({
      sellerEmail: req.params.email
    });

    const lowStock = products.filter(product => product.stock <= 5);

    res.json(lowStock);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});

app.post("/send-chat", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "voice", maxCount: 1 }
]), async (req, res) => {

  try {

    const chatData = req.body;

if (req.files?.image) {
  chatData.image = "/uploads/" + req.files.image[0].filename;
}

if (req.files?.voice) {
  chatData.voice = "/uploads/" + req.files.voice[0].filename;
}

const chat = new Chat(chatData);

await chat.save();

    res.send("Message Sent");

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/customer-chat/:sellerEmail/:customerName", async (req, res) => {

  try {

    const chats = await Chat.find({

      sellerEmail: req.params.sellerEmail,

      customerName: req.params.customerName

    }).sort({ createdAt: 1 });

    res.json(chats);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-chat/:email", async (req, res) => {

  try {

    const chats = await Chat.find({

      sellerEmail: req.params.email

    }).sort({ createdAt: 1 });

    res.json(chats);

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.put("/mark-seen", async (req, res) => {

  try {

    const { sellerEmail, customerName } = req.body;

    await Chat.updateMany(

      {

        sellerEmail,

        customerName,

        sender: "Seller",

        seen: false

      },

      {

        $set: {

          seen: true

        }

      }

    );

    res.send("Seen Updated");

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
app.get("/seller-status/:email", async (req, res) => {

  try {

    const seller = await Seller.findOne({
      email: req.params.email
    });

    if (!seller) {
      return res.json({
        online: false,
        lastSeen: null
      });
    }

    res.json({
      online: seller.online,
      lastSeen: seller.lastSeen
    });

  } catch (err) {

    console.log(err);

    res.status(500).send("Failed");

  }

});
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server Running"
  );

});
