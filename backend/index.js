const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const config = require("./backendConfig");

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

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Vendor = mongoose.model("vendors", VendorSchema);

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Order = mongoose.model("orders", OrderSchema);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
const Product = mongoose.model("parent_products", ProductSchema);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    console.log("orders:", orders);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving orders");
  }
});

app.get("/products/sales", async (req, res) => {
  try {
    const { vendorId } = req.query;
    const productSales = await Order.aggregate([
      ...orderAndProductJoin(vendorId),
      {
        $group: {
          _id: "$cart_item.product",
          totalSold: { $sum: "$cart_item.item_count" },
          totalRevenue: { $sum: "$cart_item.price" },
          vendorId: { $first: "productDetails.vendor" },
          productName: { $first: "$productDetails.name" },
        },
      },
      {
        $project: {
          productId: "$_id",
          productName: 1,
          totalSold: 1,
          totalRevenue: 1,
          vendorId: 1,
          _id: 0,
        },
      },
      {
        $sort: { totalSold: -1 },
      },
    ]);
    res.json(productSales);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving product sales data");
  }
});

app.get("/products/monthly-sales", async (req, res) => {
  try {
    const { vendorId } = req.query;

    const monthlySales = await Order.aggregate([
      ...orderAndProductJoin(vendorId),
      {
        $group: {
          _id: {
            month: { $month: { $toDate: "$payment_at" } },
            year: { $year: { $toDate: "$payment_at" } },
          },
          totalSold: { $sum: "$cart_item.item_count" },
          totalRevenue: { $sum: "$cart_item.price" },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          totalSold: 1,
          totalRevenue: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    res.json(monthlySales);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving monthly sales data");
  }
});

const orderAndProductJoin = function (vendorId) {
  return [
    {
      $unwind: "$cart_item",
    },
    {
      $lookup: {
        from: "parent_products",
        localField: "cart_item.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $match: {
        "productDetails.vendor": mongoose.Types.ObjectId(vendorId),
      },
    },
  ];
};
app.listen(5000, () => {
  console.log("App listening on port 5000");
});
