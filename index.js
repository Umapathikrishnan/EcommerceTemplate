const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Product = require("./models/products");
const User = require("./models/users");
const { mongodb_connection_url } = require("./config/database.config");
const verifyToken = require("./middleware/auth");

const app = express();

mongoose
  .connect(mongodb_connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", verifyToken, (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

// get all products
app.get("/products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    console.log("p", products);
    res.status(200).json(products);
  } catch (error) {
    console.log("e", error);
    res.status(404).json({ message: error.message });
  }
});

//get user by id
app.get("/products/:productsId", verifyToken, async (req, res) => {
  try {
    const productId = req.params.productsId;
    if (!productId)
      return res.status(404).json({ message: "Product not found :(" });
    const product = await Product.findById(productId);
    res.status(200).json(product);
    console.log("Done: p", product);
  } catch (error) {
    console.error("Error in finding getProductById", error);
    res.status(500).json("Internal Server Error :(");
  }
});

// user - signup
app.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in User signup", error);
    res.status(500).json({ message: "Error in user signup" });
  }
});

//user login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("pwd", user, user.password);
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log(
    `Server is listening on port 3000, mongo url ${mongodb_connection_url}}`
  );
});
