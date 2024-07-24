"use client";
import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./page.module.css";
import Box from "@/components/Box";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import Icon from "@/components/Icon";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [iconName, setIconName] = useState("eye_off");

  const [step, setStep] = useState(1);

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)!;

    setPhone(
      !value[2]
        ? value[1]
        : "(" + value[1] + ") " + value[2] + (value[3] ? "-" + value[3] : "")
    );
  }

  function handleBirthDateDay(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (
      value === "" ||
      (value.length <= 2 && value.match(/^(0[1-9]|[12][0-9]|3[01]|\d)$/))
    ) {
      setBirthDate((prevState) => ({
        ...prevState,
        day: value,
      }));
    }
  }

  function handleBirthDateMonth(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (
      value === "" ||
      (value.length <= 2 && value.match(/^(0[1-9]|1[0-2]|\d)$/))
    ) {
      setBirthDate((prevState) => ({
        ...prevState,
        month: value,
      }));
    }
  }

  function handleBirthDateYear(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (value === "" || (value.length <= 4 && value.match(/^\d{0,4}$/))) {
      setBirthDate((prevState) => ({
        ...prevState,
        year: value,
      }));
    }
  }

  function handleGender(e: ChangeEvent<HTMLInputElement>) {
    setGender(e.target.value);
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

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        birth_date: new Date(
          `${birthDate.year}-${birthDate.month}-${birthDate.day}`
        ),
        gender: Boolean(gender),
        password: password,
      }),
    });

    if (response.status == 200) {
      router.push("/");
    }
  }

  return (
    <Box width={"25rem"}>
      {step == 1 ? (
        <form onSubmit={next}>
          <Input
            label="E-mail"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="First name"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last name"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Button disabled={!email || !firstName || !lastName}>Next</Button>
          <Link href="/login" style={{ textAlign: "center", fontSize: "14px" }}>
            Sign In
          </Link>
        </form>
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            label="Phone number"
            type="text"
            name="phone"
            value={phone}
            onChange={handlePhone}
          />
          <div className={styles.row}>
            <Input
              label="Day"
              type="text"
              name="day"
              value={birthDate.day}
              onChange={handleBirthDateDay}
            />
            <Input
              label="Month"
              type="text"
              name="month"
              value={birthDate.month}
              onChange={handleBirthDateMonth}
            />
            <Input
              label="Year"
              type="text"
              name="year"
              value={birthDate.year}
              onChange={handleBirthDateYear}
            />
          </div>
          <div className={styles.column}>
            <label>Gender</label>
            <div className={styles.row}>
              <Radio
                label="Male"
                name="gender"
                value={"true"}
                onChange={handleGender}
              />
              <Radio
                label="Female"
                name="gender"
                value={"false"}
                onChange={handleGender}
              />
            </div>
          </div>
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
          <Button
            disabled={
              !phone ||
              !birthDate.day ||
              !birthDate.month ||
              !birthDate.year ||
              !gender ||
              !password
            }
          >
            Create Account
          </Button>
        </form>
      )}
    </Box>
  );
}
