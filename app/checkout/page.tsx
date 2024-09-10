"use client";
import { useState, useEffect, ChangeEvent } from "react";
import styles from "./page.module.css";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Icon from "@/components/ui/Icon";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LayoutBox from "@/components/layout/LayoutBox";
import Link from "next/link";
import CartLayout from "@/components/cart/CartLayout";
import Address from "@/components/ui/Address";
import Input from "@/components/ui/Input";
import Meta from "@/components/layout/Meta";

interface Card {
  number: string;
  holder: string;
  expiration_month: string;
  expiration_year: string;
  cvv: number;
}

export default function Cart() {
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<number | null>();

  useEffect(() => {
    fetch("/api/cart")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setProducts(data);
      });

    fetch("/api/addresses")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setAddresses(data);
        setLoading(false);
      });
  }, []);

  const [card, setCard] = useState<Card>();

  const cardRegex: Record<keyof Card, (value: string) => string> = {
    number: (value) =>
      value.replace(/[^0-9]/gi, "").replace(/(\d{4})(?=\d)/g, "$1 "),
    holder: (value) => value.toLocaleUpperCase("tr-TR"),
    expiration_month: (value) => {
      const match = value.match(/^(0[1-9]|1[0-2]|\d)$/);
      return match ? match[0] : "";
    },
    expiration_year: (value) => value.replace(/[^0-9]/gi, ""),
    cvv: (value) => value.replace(/[^0-9]/gi, ""),
  };

  function handleCard(e: ChangeEvent<HTMLInputElement>) {
    setCard({
      ...card!,
      [e.target.name]: cardRegex[e.target.name as keyof Card]!(e.target.value),
    });
  }

  return (
    <CartLayout products={products} selectedAddress={selectedAddress!}>
      <LayoutContainer>
        <LayoutTitle className={styles.layoutTitle}>
          <Link href={"/cart"} className={styles.previousButton}>
            <Icon name="previous" />
          </Link>
          <Meta title="Checkout" />
        </LayoutTitle>
        <LayoutBox className={styles.box} minHeight="660px">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className={styles.innerTitle}>Select address</div>
              <div className={styles.row}>
                {addresses.map((address) => (
                  <Address
                    className={`${styles.address} ${
                      selectedAddress === address.id && styles.selected
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                    title={address.title}
                    customerName={address.customer_name}
                    address={address.address}
                    key={address.id}
                  />
                ))}
              </div>
              <div className={styles.innerTitle}>Card</div>
              <div className={styles.cardContainer}>
                <div className={styles.card}>
                  <div className={styles.cardNumber}>
                    {card?.number ? card?.number : "**** **** **** ****"}
                  </div>
                  <div className={styles.spaceBetween}>
                    <div>{card?.holder}</div>
                    <div>
                      {card?.expiration_month ? card?.expiration_month : "MM"} /{" "}
                      {card?.expiration_year ? card?.expiration_year : "YY"}
                    </div>
                  </div>
                </div>
                <div className={styles.column}>
                  <Input
                    label="Card number"
                    placeholder="1234 5678 9123 4567"
                    type="text"
                    name="number"
                    maxLength={19}
                    value={card?.number ?? ""}
                    onChange={handleCard}
                  />
                  <Input
                    label="Card holder"
                    type="text"
                    name="holder"
                    value={card?.holder ?? ""}
                    onChange={handleCard}
                  />
                  <div className={styles.spaceBetween}>
                    <div>
                      <label>Expiration date</label>
                      <div className={styles.expirationDate}>
                        <Input
                          placeholder="MM"
                          type="text"
                          name="expiration_month"
                          maxLength={2}
                          value={card?.expiration_month ?? ""}
                          onChange={handleCard}
                        />
                        <Input
                          placeholder="YY"
                          type="text"
                          name="expiration_year"
                          maxLength={2}
                          value={card?.expiration_year ?? ""}
                          onChange={handleCard}
                        />
                      </div>
                    </div>
                    <div style={{ width: "4rem" }}>
                      <label>CVV2</label>
                      <Input
                        placeholder="123"
                        type="text"
                        name="cvv"
                        maxLength={3}
                        value={card?.cvv ?? ""}
                        onChange={handleCard}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </LayoutBox>
      </LayoutContainer>
    </CartLayout>
  );
}
