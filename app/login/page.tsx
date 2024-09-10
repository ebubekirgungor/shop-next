import styles from "./page.module.css";
import Box from "@/components/ui/Box";
import LoginForm from "@/components/login/LoginForm";
import { Metadata } from "next";

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
