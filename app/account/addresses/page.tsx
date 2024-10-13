"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import { jsonFetcher } from "@/lib/fetchers";

import {
  LayoutContainer,
  LayoutTitle,
  LayoutBox,
  Meta,
} from "@/components/layout";
import {
  Address,
  Button,
  Dialog,
  Input,
  LoadingSpinner,
} from "@/components/ui";

type DialogType = "POST" | "PUT" | "DELETE";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setLoading] = useState(true);

  async function getAllAddresses() {
    await fetch("/api/addresses")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setAddresses(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    getAllAddresses();
  }, []);

  const [dialogType, setDialogType] = useState<DialogType>();
  const [dialog, setDialog] = useState(false);
  const [dialogStatus, setDialogStatus] = useState(false);

  function openDialog(type: DialogType, address: Address) {
    setDialogType(type);
    setNewAddress(address);
    setDialogStatus(true);
    setDialog(true);
  }

  function closeDialog() {
    setDialogStatus(false);
    setTimeout(() => setDialog(false), 300);
  }

  const [newAddress, setNewAddress] = useState<Address>();

  function handleNewAddress(e: ChangeEvent<HTMLInputElement>) {
    setNewAddress({
      ...newAddress!,
      [e.target.name]: e.target.value,
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await jsonFetcher(
      "/api/addresses",
      dialogType!,
      newAddress!
    );

    closeDialog();

    if (response.status === 200) {
      switch (dialogType) {
        case "POST":
          setAddresses((prev) => [...prev, response.body]);
          break;
        case "PUT":
          setAddresses((prev) =>
            prev.map((address) => {
              return address.id === newAddress?.id ? newAddress : address;
            })
          );
          break;
        case "DELETE":
          setAddresses((prev) =>
            prev.filter((address) => address.id !== newAddress?.id)
          );
          break;
      }
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <LayoutContainer>
      <LayoutTitle>
        <Meta title="Addresses" />
      </LayoutTitle>
      <LayoutBox minHeight="274px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.row}>
            <button
              className={styles.addBox}
              onClick={() =>
                openDialog("POST", {
                  id: null,
                  title: "",
                  customer_name: "",
                  address: "",
                })
              }
            />
            {addresses.map((address) => (
              <Address
                title={address.title}
                customerName={address.customer_name}
                address={address.address}
                editButton={() => openDialog("PUT", address)}
                deleteButton={() => openDialog("DELETE", address)}
                key={address.id}
              />
            ))}
          </div>
        )}
        {dialog && (
          <Dialog
            title={
              {
                POST: "Add new address",
                PUT: "Edit address",
                DELETE: "Delete address",
              }[dialogType!]
            }
            close={closeDialog}
            status={dialogStatus}
          >
            <form onSubmit={onSubmit}>
              {dialogType != "DELETE" ? (
                <>
                  <Input
                    label="Title"
                    type="text"
                    name="title"
                    value={newAddress?.title}
                    required
                    onChange={handleNewAddress}
                  />
                  <Input
                    label="Customer name"
                    type="text"
                    name="customer_name"
                    value={newAddress?.customer_name}
                    required
                    onChange={handleNewAddress}
                  />
                  <Input
                    label="Address"
                    type="text"
                    name="address"
                    value={newAddress?.address}
                    required
                    onChange={handleNewAddress}
                  />
                </>
              ) : (
                <div style={{ textAlign: "center" }}>Are you sure?</div>
              )}
              <Button>
                {
                  {
                    POST: "Create",
                    PUT: "Update",
                    DELETE: "Delete",
                  }[dialogType!]
                }
              </Button>
            </form>
          </Dialog>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
