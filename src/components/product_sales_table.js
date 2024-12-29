import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import config from "../config"; 

const ProductSalesTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/products/sales?vendorId=${config.defaultVendorId}`
        );
        console.log("response", response);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("productName", {
      header: "Product Name",
    }),
    columnHelper.accessor("totalSold", {
      header: "Total Sold",
    }),
    columnHelper.accessor("totalRevenue", {
      header: "Total Revenue",
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table style={{ border: "1px solid black", width: "100%", textAlign: "left" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} style={{ borderBottom: "2px solid black" }}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductSalesTable;
