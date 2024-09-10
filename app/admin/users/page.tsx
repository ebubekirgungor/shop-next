"use client";
import { useState, useEffect } from "react";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutBox from "@/components/layout/LayoutBox";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DataTable from "@/components/ui/DataTable";
import Chip from "@/components/ui/Chip";
import Link from "next/link";
import styles from "./page.module.css";
import Meta from "@/components/layout/Meta";

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
