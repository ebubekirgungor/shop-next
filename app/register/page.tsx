import styles from "./page.module.css";
import { Metadata } from "next";

import { Box } from "@/components/ui";
import { RegisterForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className={styles.boxContainer}>
      Create new account
      <Box className={styles.box}>
        <RegisterForm />
      </Box>
    </div>
  );
}
