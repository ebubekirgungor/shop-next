import Icon from "../Icon";
import styles from "./DataTable.module.css";
import { useState } from "react";
import sortBy from "lodash/sortBy";

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
  const [sort, setSort] = useState({
    field: "",
    isReverse: false,
  });

  function handleSort(field: string) {
    const isReverse = sort.field === field && !sort.isReverse;
    setSort({ field, isReverse });
  }

  const sortedList = sort.isReverse
    ? sortBy(data, sort.field).reverse()
    : sortBy(data, sort.field);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>
              <div
                className={styles.columnTitle}
                onClick={() => handleSort(column.key)}
              >
                {column.title}
                <span
                  className={
                    sort.field === column.key && sort.isReverse
                      ? styles.arrowRotate
                      : sort.field !== column.key
                      ? styles.arrow
                      : styles.arrowActive
                  }
                >
                  <Icon name="arrow"></Icon>
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedList ? (
          sortedList.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
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
      <tfoot>
        <tr>
          <td colSpan={columns.length}>
            <div className={styles.actions}>
              <button>
                <Icon name="first"></Icon>
              </button>
              <button>
                <Icon name="previous"></Icon>
              </button>
              <button>
                <Icon name="next"></Icon>
              </button>
              <button>
                <Icon name="last"></Icon>
              </button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default DataTable;
