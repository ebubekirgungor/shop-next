"use client";
import styles from "./DataTable.module.css";
import { ChangeEvent, useState } from "react";
import sortBy from "lodash/sortBy";
import Link from "next/link";
import Image from "next/image";

import { Icon, Input } from "@/components/ui";

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
  imageUrl?: string;
}

const itemsPerPageOptions = [5, 10, 25, 50, 100];

const DataTable = ({ columns, data, imageUrl }: DataTableProps) => {
  const [searchedData, setSearchedData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const sortedData = sort.isReverse
    ? sortBy(searchedData, sort.field).reverse()
    : sortBy(searchedData, sort.field);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const displayedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className={styles.container}>
      <Input placeholder="Search" onChange={handleSearch} />
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {imageUrl && <th style={{ width: "6rem" }}></th>}
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
                      <Icon name="arrow" />
                    </span>
                  </div>
                </th>
              ))}
              <th style={{ width: "3rem" }} />
            </tr>
          </thead>
          <tbody>
            {displayedData.length ? (
              displayedData.map((row) => (
                <tr key={row.id}>
                  {imageUrl && (
                    <td>
                      <Link href={"/product/" + row.url}>
                        <Image
                          className={styles.image}
                          src={imageUrl + row.image}
                          alt={row.image}
                          width="0"
                          height="0"
                          sizes="4rem"
                        />
                      </Link>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key}>{row[column.key]}</td>
                  ))}
                  <td style={{ padding: "0" }}>
                    <Link
                      href={window.location.pathname + "/" + row.id}
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
              <td colSpan={columns.length + (imageUrl ? 2 : 1)}>
                <div className={styles.tableFooter}>
                  <div className={styles.actions}>
                    <label htmlFor={"itemsPerPage"}>Items per page:</label>
                    <select
                      id={"itemsPerPage"}
                      style={{ width: "5rem" }}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage == 1}
                    >
                      <Icon name="first" />
                    </button>
                    <button
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                      disabled={currentPage == 1}
                    >
                      <Icon name="previous" />
                    </button>
                    <button
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                      disabled={currentPage == totalPages || totalPages == 0}
                    >
                      <Icon name="next" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage == totalPages || totalPages == 0}
                    >
                      <Icon name="last" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
