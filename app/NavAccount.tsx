"use client";
import styles from "./layout.module.css";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import NavButton from "@/components/NavButton";
import Box from "@/components/Box";
import { Role } from "@/lib/enums";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { setRole } from "@/lib/userSlice";
import { useEffect } from "react";

export default function NavAccount() {
  const router = useRouter();
  const role = useAppSelector((user) => user.role).role;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!role) {
      dispatch(setRole(localStorage.getItem("role") ?? ""));
    }
  }, []);

  async function logout() {
    const response = await fetch("/api/auth/logout");

    if (response.status === 200) {
      dispatch(setRole(""));
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
        {role && Number(role) === Role.ADMIN && (
          <NavButton icon="admin" href={"/admin/categories"}>
            Admin
          </NavButton>
        )}
        <button type="button" onClick={logout}>
          <Icon name="logout" />
          Logout
        </button>
      </Box>
    </div>
  ) : (
    <NavButton icon="account" href={"/login"}>
      Login
    </NavButton>
  );
}
