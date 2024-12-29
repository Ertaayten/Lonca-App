import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

const ProductSalesTable = ({ data }) => {
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
    <div
      style={{
        border: "1px solid black",
        width: "100%",
        height: "90vh", 
        overflow: "auto", 
      }}
    >
      <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "left" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ borderBottom: "2px solid black" }}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ padding: "8px", textAlign: "left" }}>
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
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSalesTable;
