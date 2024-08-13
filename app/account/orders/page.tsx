"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Box from "@/components/Box";
import Image from "next/image";
import Link from "next/link";
import Chip from "@/components/Chip";
import Input from "@/components/Input";
import NoItem from "@/components/NoItem";

function OrderInfo({ title, info }: { title: string; info: string | number }) {
  return (
    <div>
      <div className={styles.orderHeaderTitle}>{title}</div>
      <div className={styles.orderHeaderInfo}>{info}</div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((response) => (response.status === 200 ? response.json() : []))
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  const dateOptions: Object = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  type DeliveryStatus =
    | "DELIVERED"
    | "IN_PROGRESS"
    | "RETURNED"
    | "CANCELED"
    | null;

  const statusNames = [
    {
      title: "All",
      icon: "",
      status: null,
    },
    {
      title: "Delivered",
      icon: "check",
      status: "DELIVERED",
    },
    {
      title: "In progress",
      icon: "progress",
      status: "IN_PROGRESS",
    },
    {
      title: "Returned",
      icon: "return",
      status: "RETURNED",
    },
    {
      title: "Canceled",
      icon: "close",
      status: "CANCELED",
    },
  ];

  const [statusFilter, setStatusFilter] = useState<DeliveryStatus>(null);

  const filteredOrders = orders.filter((order) =>
    statusFilter
      ? (order.delivery_status as unknown as string) === statusFilter
      : true
  );

  const [search, setSearch] = useState("");

  const searchedOrders = filteredOrders.filter((order) => {
    const filteredProducts = order.products.filter((product) => {
      return product.title.toLowerCase().includes(search.toLowerCase());
    });
    return filteredProducts.length > 0;
  });

  return (
    <LayoutContainer>
      <LayoutTitle>
        Orders
        {statusNames.map((status) =>
          status.status !== "DELIVERED" ? (
            <Chip
              selected={statusFilter === status.status}
              onClick={() => setStatusFilter(status.status as DeliveryStatus)}
              key={status.status}
            >
              {status.title}
            </Chip>
          ) : null
        )}
      </LayoutTitle>
      <LayoutBox minHeight="360px">
        {isLoading ? (
          <LoadingSpinner />
        ) : searchedOrders.length === 0 ? (
          <NoItem icon="order" description="You don't have an order yet" />
        ) : (
          <div className={styles.column}>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchedOrders.map((order) => (
              <Box className={styles.order} key={order.id}>
                <div className={styles.orderHeader}>
                  <OrderInfo
                    title="Order date"
                    info={new Date(order.created_at).toLocaleString(
                      "tr-TR",
                      dateOptions
                    )}
                  />
                  <OrderInfo title="Customer" info={order.customer_name} />
                  <OrderInfo title="Total amount" info={order.total_amount} />
                  <OrderInfo
                    title="Total products"
                    info={order.products.reduce(
                      (total: number, product: OrderProduct) => {
                        return total + product.quantity;
                      },
                      0
                    )}
                  />
                </div>

                <div className={styles.orderProducts}>
                  {order.products.map((product: OrderProduct) => (
                    <Link href={"/product/" + product.url} key={product.url}>
                      <Image
                        src={"/images/products/" + product.image}
                        alt={product.image}
                        width="0"
                        height="0"
                        sizes="6rem"
                      />
                      <div className={styles.quantityBadge}>
                        {product.quantity}
                      </div>
                    </Link>
                  ))}
                </div>
              </Box>
            ))}
          </div>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
