import Icon from "../Icon";
import styles from "./DataTable.module.css";
import { ChangeEvent, useState } from "react";
import sortBy from "lodash/sortBy";
import Input from "../Input";
import Link from "next/link";

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
  const [searchedData, setSearchedData] = useState(data);

  const [sort, setSort] = useState({
    field: "",
    isReverse: false,
  });

  function handleSort(field: string) {
    const isReverse = sort.field === field && !sort.isReverse;
    setSort({ field, isReverse });
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearchedData(
      data.filter((item: Data) =>
        item[columns[0].key]
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
    );
  }

  const displayedData = sort.isReverse
    ? sortBy(searchedData, sort.field).reverse()
    : sortBy(searchedData, sort.field);

  return (
    <div className={styles.container}>
      <Input placeholder="Search" onChange={handleSearch} />
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
            <th style={{ width: "3rem" }}></th>
          </tr>
        </thead>
        <tbody>
          {displayedData.length ? (
            displayedData.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
                <td style={{ padding: "0" }}>
                  <Link
                    href={window.location.pathname + "/" + row.id.toString()}
                    className={styles.editButton}
                  >
                    <Icon name="edit" />
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className={styles.noResult}>
                No results
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={columns.length + 1}>
              <div className={styles.tableFooter}>
                {displayedData.length} items
                <div className={styles.actions}>
                  <button>
                    <Icon name="first" />
                  </button>
                  <button>
                    <Icon name="previous" />
                  </button>
                  <button>
                    <Icon name="next" />
                  </button>
                  <button>
                    <Icon name="last" />
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DataTable;
