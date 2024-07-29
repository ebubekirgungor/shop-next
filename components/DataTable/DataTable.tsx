import styles from "./DataTable.module.css";
import { useState } from "react";

interface Column {
  key: string;
  title: string;
}

interface Data {
  [key: string]: any;
}

interface DataTableProps {
  columns: Column[];
  data: Data[];
}

export const DataTable = ({ columns, data }: DataTableProps) => {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.key.includes(".")
                      ? row[column.key.split(".")[0]][column.key.split(".")[1]]
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noResult}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.actions}>
        <button>Previous</button>
        <button>Next</button>
      </div>
    </>
  );
};

export default DataTable;
