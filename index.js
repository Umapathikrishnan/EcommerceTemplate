const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Product = require("./models/products");
const { mongodb_connection_url } = require("./config/database.config");

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

app.get("/", (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

app.get("/products", async (req, res) => {
  // try {
  //   const products = await Product.find();
  //   console.log("products::", JSON.stringify(products));
  //   res.json(products);
  // } catch (error) {
  //   res.status(500);
  // }
  try {
    const products = await Product.find();
    console.log("p", products);
    res.status(200).json(products);
  } catch (error) {
    console.log("e", error);
    res.status(404).json({ message: error.message });
  }
});
app.listen(3000, () => {
  console.log(
    `Server is listening on port 3000, mongo url ${mongodb_connection_url}}`
  );
});
