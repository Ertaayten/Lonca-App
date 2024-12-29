import React from "react";
import "./App.css";
import ProductSalesTable from "./components/product_sales_table";
import { Tabs } from 'antd';

function App() {
  const items = [
    {
      key: '1',
      label: 'Product Sales Table',
      children: <ProductSalesTable></ProductSalesTable>,
    },
    {
      key: '2',
      label: 'Chart',
      children: 'Content of Tab Pane 2',
    }
  ];

  return (
    <div className="App container">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default App;
