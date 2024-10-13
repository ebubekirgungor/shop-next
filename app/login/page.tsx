import styles from "./page.module.css";
import { Metadata } from "next";

import { Box } from "@/components/ui";
import { LoginForm } from "@/components/auth";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className={styles.boxContainer}>
      Sign in to your account
      <Box className={styles.box}>
        <LoginForm />
      </Box>
    </div>
  );
}
