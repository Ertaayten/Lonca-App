const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const config = require("./backendConfig");

// MongoDB bağlantısı
mongoose.set("strictQuery", false);
mongoose.connect(
  config.connectionString,
  {
    dbName: config.dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) =>
    err ? console.log("err", err) : console.log("Connected to the database")
);

// Vendor Schema tanımı
const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Vendor = mongoose.model("vendors", VendorSchema);


// Order Schema tanımı
const OrderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  });
  const Order = mongoose.model("orders", OrderSchema);

  // Product Schema tanımı
const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  });
  const Product = mongoose.model("parent_products", ProductSchema);
// Express app başlatma
const app = express();
app.use(express.json());
app.use(cors());

app.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find(); // Tüm vendors'u getirir
    console.log("Vendors:", vendors); // Console'a yazdırır
    res.json(vendors); // JSON olarak döner
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving vendors");
  }
});
app.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find(); // Tüm vendors'u getirir
      console.log("orders:", orders); // Console'a yazdırır
      res.json(orders); // JSON olarak döner
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving orders");
    }
  });
  app.get("/products", async (req, res) => {
    try {
      const products = await Product.find(); // Tüm vendors'u getirir
      console.log("Products:", products); // Console'a yazdırır
      res.json(products); // JSON olarak döner
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving products");
    }
  });

  app.get("/products/sales", async (req, res) => {
    try {
      const { vendorId } = req.query; // Vendor ID'yi sorgu parametresinden al
      const productSales = await Order.aggregate([
        { 
          $unwind: "$cart_item" // cart_item array'ini aç
        },
        {
          $lookup: {
            from: "parent_products", // parent_products koleksiyonuyla birleştir
            localField: "cart_item.product", // cart_item içindeki product ID
            foreignField: "_id", // parent_products'taki _id
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails" // productDetails'i aç
        },
        {
          $match: {
            "productDetails.vendor": mongoose.Types.ObjectId(vendorId) // Vendor ID eşleşmesi
          }
        },
        {
          $group: {
            _id: "$cart_item.product", // product ID'ye göre gruplandır
            totalSold: { $sum: "$cart_item.item_count" }, // Toplam satılan miktar
            totalRevenue: { $sum: "$cart_item.price" }, // Toplam gelir
            vendorId: { $first: "productDetails.vendor" }, // Vendor ID
            productName: { $first: "$productDetails.name" }, // Ürün adı
          },
        },
        {
          $project: {
            productId: "$_id",
            productName: 1,
            totalSold: 1,
            totalRevenue: 1,
            vendorId: 1,
            _id: 0, // _id'yi dışlama
          },
        },
        {
          $sort: { totalSold: -1 } // Satış miktarına göre azalan sırada
        }
      ]);
      res.json(productSales);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving product sales data");
    }
  });
  
  
  

app.listen(5000, () => {
  console.log("App listening on port 5000");
});

