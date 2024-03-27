const Product = require("../models/products");

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("p", products);
    res.status(200).json(products);
  } catch (error) {
    console.log("e", error);
    res.status(404).json({ message: error.message });
  }
};

//get product by id
exports.getProductById = async (req, res) => {
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
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      category,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Error in product creation", error);
    res.status(500).json({ message: "Error in product creation" });
  }
};

exports.deleteProductById = async (req, res) => {
  const productId = req.params.productId;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found :)" });
  }
  res.status(200).json({ message: "Product deleted successfully." });
};
