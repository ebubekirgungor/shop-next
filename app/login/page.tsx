"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./page.module.css";
import Box from "@/components/Box";
import Input from "@/components/Input";
import CheckBox from "@/components/CheckBox";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "../../lib/hooks";
import { getCookie } from "cookies-next";
import { setRole } from "../../lib/userSlice";

interface Form {
  email: string;
  password: string;
  remember_me: boolean;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<Form>();

  const [passwordType, setPasswordType] = useState("password");
  const [iconName, setIconName] = useState("eye_off");

  function handleForm(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form!,
      [e.target.name]:
        e.target.name === "remember_me" ? e.target.checked : e.target.value,
    });
  }

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
      body: JSON.stringify(form),
    });

    if (response.status == 200) {
      const role = getCookie("role") ?? "";
      dispatch(setRole(role));
      router.push("/account/personal-details");
    }
  }

  return (
    <Box width={"25rem"}>
      <form onSubmit={onSubmit}>
        <Input
          label="E-mail"
          type="text"
          name="email"
          value={form?.email ?? ""}
          onChange={handleForm}
        />
        <div>
          <Input
            label="Password"
            type={passwordType}
            name="password"
            value={form?.password ?? ""}
            onChange={handleForm}
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
          checked={form?.remember_me ?? false}
          onChange={handleForm}
        />
        <Button disabled={!form?.email || !form.password}>Sign In</Button>
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
