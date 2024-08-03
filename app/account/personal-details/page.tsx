"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import Input from "@/components/Input";
import Radio from "@/components/Radio";
import Button from "@/components/Button";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PersonalDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [gender, setGender] = useState("");

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone);
        formatPhone(data.phone);
        setEmail(data.email);
        setBirthDate(data.birth_date);
        setGender(data.gender.toString());
        setLoading(false);
      });
  }, []);

  function formatPhone(phoneNumber: string) {
    const value = phoneNumber
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)!;

    setPhone(
      !value[2]
        ? value[1]
        : "(" + value[1] + ") " + value[2] + (value[3] ? "-" + value[3] : "")
    );
  }

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    formatPhone(e.target.value);
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
        year: e.target.value,
      }));
    }
  }

  function handleGender(e: ChangeEvent<HTMLInputElement>) {
    setGender(e.target.value);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        phone: phone.replace(/\D/g, ""),
        birth_date: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
        gender: gender,
      }),
    });

    /*if (response.status == 200) {
      
    }*/
  }

  return (
    <LayoutContainer>
      <LayoutTitle>Personal Details</LayoutTitle>
      <LayoutBox minHeight="413px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.grid}>
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
              <Input
                label="Phone number"
                type="text"
                name="phone"
                value={phone}
                onChange={handlePhone}
              />
              <Input
                label="E-mail"
                type="text"
                name="email"
                defaultValue={email}
                disabled
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
              <div className={styles.column} style={{ width: "50%" }}>
                <label>Gender</label>
                <div className={styles.row}>
                  <Radio
                    label="Male"
                    name="gender"
                    value="true"
                    checked={gender === "true"}
                    onChange={handleGender}
                  />
                  <Radio
                    label="Female"
                    name="gender"
                    value="false"
                    checked={gender === "false"}
                    onChange={handleGender}
                  />
                </div>
              </div>
            </div>
            <Button>Update</Button>
          </form>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
