import React, { useEffect, useState } from "react";
import "./App.css";
import ProductSalesTable from "./components/product_sales_table";
import MonthlySalesChart from "./components/monthly_sales_chart";
import { Tabs } from "antd";
import { getProductSales, getMonthlySales } from "./services/apiService";
import config from "./config";

function App() {
  const [productSalesData, setProductSalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ürün satışlarını getir
        const productSales = await getProductSales(config.defaultVendorId);
        setProductSalesData(productSales);

        // Aylık satışları getir
        const monthlySales = await getMonthlySales(config.defaultVendorId);
        const formattedMonthlySales = monthlySales.map((item) => ({
          date: `${item.year}-${String(item.month).padStart(2, "0")}`, // YYYY-MM
          totalSold: item.totalSold,
          totalRevenue: item.totalRevenue,
        }));
        setMonthlySalesData(formattedMonthlySales);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const items = [
    {
      key: "1",
      label: "Product Sales Table",
      children: <ProductSalesTable data={productSalesData} />,
    },
    {
      key: "2",
      label: "Monthly Sales Chart",
      children: <MonthlySalesChart data={monthlySalesData} />,
    },
  ];

  return (
    <div className="App container">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default App;
