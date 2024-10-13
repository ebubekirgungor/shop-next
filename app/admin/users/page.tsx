"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

import {
  LayoutContainer,
  LayoutTitle,
  LayoutBox,
  Meta,
} from "@/components/layout";
import { Chip, DataTable, LoadingSpinner } from "@/components/ui";

const columns = [
  {
    key: "email",
    title: "E-mail",
  },
  {
    key: "first_name",
    title: "First Name",
  },
  {
    key: "last_name",
    title: "Last Name",
  },
  {
    key: "phone",
    title: "Phone Number",
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <LayoutContainer>
      <LayoutTitle className={styles.layoutTitle}>
        <Meta title="Users" />
        <Link href="users/create">
          <Chip>Add</Chip>
        </Link>
      </LayoutTitle>
      <LayoutBox minHeight="304px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
