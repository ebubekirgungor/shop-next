"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./RegisterForm.module.css";
import { birthDateRegex, formatPhone } from "@/lib/utils";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

import { Button, Icon, Input, Radio } from "@/components/ui";

export default function RegisterForm() {
  const [form, setForm] = useState<User>();

  const [passwordType, setPasswordType] = useState("password");
  const [iconName, setIconName] = useState("eye_off");

  const [step, setStep] = useState(1);

  function handleForm(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form!,
      [e.target.name]: e.target.value,
    });
  }

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev!,
      phone: formatPhone(e.target.value),
    }));
  }

  function handleBirthDate(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (birthDateRegex(e.target.name, value)) {
      setForm({
        ...form!,
        birth_date: {
          ...form?.birth_date!,
          [e.target.name]: value,
        },
      });
    }
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

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStep(2);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher("/api/auth/register", "POST", {
      email: form?.email,
      first_name: form?.first_name,
      last_name: form?.last_name,
      phone: form?.phone.replace(/\D/g, ""),
      birth_date: `${form?.birth_date.year}-${form?.birth_date.month}-${form?.birth_date.day}`,
      gender: form?.gender,
      password: form?.password,
    });

    if (response.status === 200) {
      toast.success(response.message);
      window.location.href = "/login";
    } else {
      toast.error(response.message);
    }
  }

  return step == 1 ? (
    <form onSubmit={next}>
      <Input
        label="E-mail"
        type="text"
        name="email"
        value={form?.email ?? ""}
        onChange={handleForm}
      />
      <Input
        label="First name"
        type="text"
        name="first_name"
        value={form?.first_name ?? ""}
        onChange={handleForm}
      />
      <Input
        label="Last name"
        type="text"
        name="last_name"
        value={form?.last_name ?? ""}
        onChange={handleForm}
      />
      <Button disabled={!form?.email || !form.first_name || !form.last_name}>
        Next
      </Button>
      <a href="/login" style={{ textAlign: "center", fontSize: "14px" }}>
        Sign In
      </a>
    </form>
  ) : (
    <form onSubmit={onSubmit}>
      <Input
        label="Phone number"
        type="text"
        name="phone"
        value={form?.phone ?? ""}
        onChange={handlePhone}
      />
      <div className={styles.row}>
        <Input
          label="Day"
          type="text"
          name="day"
          value={form?.birth_date?.day ?? ""}
          onChange={handleBirthDate}
        />
        <Input
          label="Month"
          type="text"
          name="month"
          value={form?.birth_date?.month ?? ""}
          onChange={handleBirthDate}
        />
        <Input
          label="Year"
          type="text"
          name="year"
          value={form?.birth_date?.year ?? ""}
          onChange={handleBirthDate}
        />
      </div>
      <div className={styles.column}>
        <label>Gender</label>
        <div className={styles.row}>
          <Radio
            label="Male"
            name="gender"
            value="true"
            checked={form?.gender === "true"}
            onChange={handleForm}
          />
          <Radio
            label="Female"
            name="gender"
            value="false"
            checked={form?.gender === "false"}
            onChange={handleForm}
          />
        </div>
      </div>
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
      <Button
        disabled={
          !form?.phone ||
          !form.birth_date?.day ||
          !form.birth_date?.month ||
          !form.birth_date?.year ||
          !form.gender ||
          !form.password
        }
      >
        Create Account
      </Button>
    </form>
  );
}
