const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
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
  password: String
});

const User = mongoose.model("User", UserSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  productName: String,
  productPrice: String,
  productCategory: String,
  productImage: String,
  
  rating:  {
    type:Number,
    default: 0
  },

  reviews: {
    type: []
  }
});

const Product = mongoose.model("Product", ProductSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  productPrice: String,
  productImage: String
});

const Cart = mongoose.model("Cart", CartSchema);
const OrderSchema = new mongoose.Schema({
  productName: String,
  productPrice: String,
  productImage: String,
  orderDate: {

    status: {
    type: String,
    default: "Pending"
  },
    
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

    const user = new User({
      email,
      password
    });

    await user.save();

    res.send("Signup Successful");

  } catch (error) {

    console.log(error);

    res.status(500).send("Signup Failed");

  }

});

// Login
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user =
      await User.findOne({
        email,
        password
      });

    if (!user) {
      return res.send(
        "Invalid Email Or Password"
      );
    }

    res.send("Login Successful");

  } catch (error) {

    console.log(error);

    res.status(500).send("Login Failed");

  }

});

// Add Product
app.post("/add-product", async (req, res) => {

  try {

    const {
      productName,
      productPrice,
      productCategory,
      productImage
    } = req.body;

    const product = new Product({
      productName,
      productPrice,
      productCategory,
      productImage
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
      productImage
    } = req.body;

    const cartItem = new Cart({
      productId,
      productName,
      productPrice,
      productImage
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

    const cartItems =
      await Cart.find();

    for (const item of cartItems) {

      const order =
        new Order({
          productName: item.productName,
          productPrice: item.productPrice,
          productImage: item.productImage
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

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
