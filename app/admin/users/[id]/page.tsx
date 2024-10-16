"use client";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { birthDateRegex, formatPhone } from "@/lib/utils";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

import {
  LayoutContainer,
  LayoutTitle,
  LayoutBox,
  Meta,
} from "@/components/layout";
import {
  Button,
  Dialog,
  Icon,
  Input,
  LoadingSpinner,
  Radio,
  Select,
} from "@/components/ui";

export default function User({ params }: { params: { id: string } }) {
  const router = useRouter();
  const isAdd = params.id === "create";

  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState(!isAdd);

  const [password, setPassword] = useState("");
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

  useEffect(() => {
    if (!isAdd) {
      fetch("/api/users/" + params.id)
        .then((response) => response.status === 200 && response.json())
        .then((data) => {
          setUser({
            ...data!,
            phone: formatPhone(data.phone),
          });
          formatPhone(data.phone);
          setLoading(false);
        });
    }
  }, []);

  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);

  function openDialog() {
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  function handleUser(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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

    const response = await jsonFetcher(
      isAdd ? "/api/users" : `/api/users/${params.id}`,
      isAdd ? "POST" : "PUT",
      {
        email: user?.email,
        password: isAdd ? password : null,
        first_name: user?.first_name,
        last_name: user?.last_name,
        phone: user?.phone?.replace(/\D/g, ""),
        birth_date: `${user?.birth_date.year}-${user?.birth_date.month}-${user?.birth_date.day}`,
        gender: user?.gender,
        role: user?.role,
      }
    );

    if (response.status === 200) {
      toast.success(response.message);
      router.push("/admin/users");
    } else {
      toast.error(response.message);
    }
  }

  async function deleteUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher("/api/users/" + params.id, "DELETE");

    if (response.status === 200) {
      toast.success(response.message);
      router.push("/admin/users");
    } else {
      toast.error(response.message);
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle className={styles.layoutTitle}>
        <Link href={"/admin/users"} className={styles.previousButton}>
          <Icon name="previous" />
        </Link>
        <Meta title={isAdd ? "Create User" : "Edit User"} />
      </LayoutTitle>
      <LayoutBox minHeight={isAdd ? "413px" : "485px"}>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.formInputsContainer}>
              <Input
                label="First name"
                type="text"
                name="first_name"
                value={user?.first_name ?? ""}
                onChange={handleUser}
              />
              <Input
                label="Last name"
                type="text"
                name="last_name"
                value={user?.last_name ?? ""}
                onChange={handleUser}
              />
              <Input
                label="Phone number"
                type="text"
                name="phone"
                value={user?.phone ?? ""}
                onChange={handlePhone}
              />
              <Input
                label="E-mail"
                type="text"
                name="email"
                value={user?.email ?? ""}
                onChange={handleUser}
              />
              <div className={styles.row}>
                <Input
                  label="Day"
                  type="text"
                  name="day"
                  value={user?.birth_date?.day ?? ""}
                  onChange={handleBirthDate}
                />
                <Input
                  label="Month"
                  type="text"
                  name="month"
                  value={user?.birth_date?.month ?? ""}
                  onChange={handleBirthDate}
                />
                <Input
                  label="Year"
                  type="text"
                  name="year"
                  value={user?.birth_date?.year ?? ""}
                  onChange={handleBirthDate}
                />
              </div>
              <div className={`${styles.row} ${styles.shortRow}`}>
                <div className={styles.genderColumn}>
                  <label>Gender</label>
                  <div className={styles.row} style={{ alignItems: "end" }}>
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
                <Select
                  label="Role"
                  name="role"
                  value={user?.role ?? Role.USER}
                  onChange={handleUser}
                >
                  <option value={Role.USER}>User</option>
                  <option value={Role.ADMIN}>Admin</option>
                </Select>
              </div>
              {isAdd && (
                <div>
                  <Input
                    label="Password"
                    type={passwordType}
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
              )}
            </div>
            <div className={styles.column}>
              <Button>{isAdd ? "Create" : "Update"}</Button>
              {!isAdd && (
                <Button
                  className={styles.deleteButton}
                  type="button"
                  onClick={openDialog}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        )}
        {dialog && (
          <Dialog
            title={"Delete user"}
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={deleteUser}>
              <div style={{ textAlign: "center" }}>Are you sure?</div>
              <Button>Delete</Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
