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
import { birthDateRegex, formatPhone } from "@/lib/utils";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

export default function PersonalDetails() {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((response) => response.status === 200 && response.json())
      .then((data) => {
        setUser({
          ...data!,
          phone: formatPhone(data.phone),
        });
        setLoading(false);
      });
  }, []);

  function handleUser(e: ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user!,
      [e.target.name]: e.target.value,
    });
  }

  function handlePhone(e: ChangeEvent<HTMLInputElement>) {
    setUser((prev) => ({
      ...prev!,
      phone: formatPhone(e.target.value),
    }));
  }

  function handleBirthDate(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (birthDateRegex(e.target.name, value)) {
      setUser({
        ...user!,
        birth_date: {
          ...user?.birth_date!,
          [e.target.name]: value,
        },
      });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher("/api/users/me", "PUT", {
      first_name: user?.first_name,
      last_name: user?.last_name,
      phone: user?.phone?.replace(/\D/g, ""),
      birth_date: `${user?.birth_date.year}-${user?.birth_date.month}-${user?.birth_date.day}`,
      gender: user?.gender,
    });

    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle>Personal Details</LayoutTitle>
      <LayoutBox minHeight="413px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formInputsContainer}>
              <Input
                label="First name"
                type="text"
                name="first_name"
                value={user?.first_name}
                onChange={handleUser}
              />
              <Input
                label="Last name"
                type="text"
                name="last_name"
                value={user?.last_name}
                onChange={handleUser}
              />
              <Input
                label="Phone number"
                type="text"
                name="phone"
                value={user?.phone}
                onChange={handlePhone}
              />
              <Input
                label="E-mail"
                type="text"
                name="email"
                defaultValue={user?.email}
                disabled
              />
              <div className={styles.row}>
                <Input
                  label="Day"
                  type="text"
                  name="day"
                  value={user?.birth_date.day}
                  onChange={handleBirthDate}
                />
                <Input
                  label="Month"
                  type="text"
                  name="month"
                  value={user?.birth_date.month}
                  onChange={handleBirthDate}
                />
                <Input
                  label="Year"
                  type="text"
                  name="year"
                  value={user?.birth_date.year}
                  onChange={handleBirthDate}
                />
              </div>
              <div className={styles.column} style={{ width: "50%" }}>
                <label>Gender</label>
                <div className={styles.row}>
                  <Radio
                    label="Male"
                    name="gender"
                    value="true"
                    checked={user?.gender === "true"}
                    onChange={handleUser}
                  />
                  <Radio
                    label="Female"
                    name="gender"
                    value="false"
                    checked={user?.gender === "false"}
                    onChange={handleUser}
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
