const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
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

app.use("/products", productRoutes);
app.use("/user", userRoutes);

app.listen(3000, () => {
  console.log(
    `Server is listening on port 3000, mongo url ${mongodb_connection_url}}`
  );
});
