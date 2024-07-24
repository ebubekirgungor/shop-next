"use client";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";
import Box from "@/components/Box";
import Input from "@/components/Input";
import CheckBox from "@/components/CheckBox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [iconName, setIconName] = useState("eye_off");

  function handlePasswordType() {
    if (passwordType == "password") {
      setPasswordType("text");
      setIconName("eye");
    } else {
      setPasswordType("password");
      setIconName("eye_off");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        remember_me: rememberMe,
      }),
    });

    if (response.status == 200) {
      router.push("/");
    }
  }

  return (
    <Box width={"25rem"}>
      <form onSubmit={onSubmit}>
        <Input
          label="E-mail"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div>
          <Input
            label="Password"
            type={passwordType}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>
            <button
              type="button"
              className={styles.eye}
              onClick={handlePasswordType}
            >
              <Icon name={iconName} />
            </button>
          </span>
        </div>
        <CheckBox
          label="Remember me"
          id="remember_me"
          name="remember_me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Button disabled={!email || !password}>Sign In</Button>
        <Link
          href="/register"
          style={{ textAlign: "center", fontSize: "14px" }}
        >
          Create Account
        </Link>
      </form>
    </Box>
  );
}
