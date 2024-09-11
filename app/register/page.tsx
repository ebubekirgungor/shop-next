import styles from "./page.module.css";
import Box from "@/components/ui/Box";
import { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";

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
