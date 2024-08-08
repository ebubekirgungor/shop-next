"use client";

import Box from "@/components/Box";
import NavButton from "@/components/NavButton";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import styles from "./layout.module.css";
import { Role } from "@/enums";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";

export default function NavLoginLink() {
  const router = useRouter();
  const [role, setRole] = useState<number | null>();

  useEffect(() => {
    setRole(Number(getCookie("role")) || null);
  }, []);

  async function logout() {
    const response = await fetch("/api/auth/logout");

    if (response.status === 200) {
      setRole(null);
      router.push("/");
    }
  }

  return role ? (
    <div className={styles.accountBoxContainer}>
      <NavButton icon="account" href={"/account/personal-details"}>
        Account
        <Icon name="expand_more" />
      </NavButton>
      <Box className={styles.accountBox} width="9rem" height="auto">
        {role === Role.ADMIN && (
          <NavButton icon="admin" href={"/admin/categories"}>
            Admin
          </NavButton>
        )}
        <button type="button" onClick={logout}>
          <Icon name="logout" /> Logout
        </button>
      </Box>
    </div>
  ) : (
    <NavButton icon="account" href={"/login"}>
      Login
    </NavButton>
  );
}
