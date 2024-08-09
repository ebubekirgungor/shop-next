"use client";
import { useState, useEffect } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import DataTable from "@/components/DataTable";
import Chip from "@/components/Chip";
import Link from "next/link";

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
      <LayoutTitle>
        Users
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
