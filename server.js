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

  stock: {
  type: Number,
  default: 0
},
  
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
  productImage: String,
  
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

  sender: String,

  receiver: String,

  productId: String,

  message: String,

  createdAt: {

    type: Date,

    default: Date.now

  }

});
const Chat = mongoose.model(
  "Chat",
  ChatSchema
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
    message:
    "Invalid Email Or Password",
    isAdmin: false
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
      stock
    } = req.body;

    const product = new Product({
      productName,
      productPrice,
      productCategory,
      productImage,
      stock
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

      const {

        email,

        password

      } = req.body;

      const seller =
        await Seller.findOne({

          email

        });

      if (!seller) {

        return res.send(
          "Seller Not Found"
        );

      }

      const match =
        await bcrypt.compare(

          password,

          seller.password

        );

      if (!match) {

        return res.send(
          "Wrong Password"
        );

      }

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
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server Running"
  );

});
