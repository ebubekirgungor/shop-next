"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/layout/LayoutContainer";
import LayoutBox from "@/components/layout/LayoutBox";
import LayoutTitle from "@/components/layout/LayoutTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Box from "@/components/ui/Box";
import Image from "next/image";
import Link from "next/link";
import Chip from "@/components/ui/Chip";
import Input from "@/components/ui/Input";
import NoItem from "@/components/ui/NoItem";
import Icon from "@/components/ui/Icon";
import { DeliveryStatus } from "@/lib/types";
import Button from "@/components/ui/Button";
import { dateOptions, statusNames } from "./orderUtils";

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

  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | null>(null);

  const filteredOrders = orders.filter((order) =>
    statusFilter ? order.delivery_status === statusFilter : true
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
        <div className={styles.row}>
          {Array.from(statusNames.keys()).map((status) =>
            status !== DeliveryStatus.DELIVERED ? (
              <Chip
                selected={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                key={status}
              >
                {statusNames.get(status)?.title}
              </Chip>
            ) : null
          )}
        </div>
      </LayoutTitle>
      <LayoutBox minHeight="360px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.column}>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchedOrders.length === 0 ? (
              <NoItem icon="order" description="You don't have an order yet" />
            ) : (
              searchedOrders.map((order) => (
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
                    <OrderInfo
                      title="Total amount"
                      info={order.total_amount.toLocaleString("tr-TR") + " TL"}
                    />
                    <OrderInfo
                      title="Total products"
                      info={order.products.reduce(
                        (total: number, product: OrderProduct) => {
                          return total + product.quantity;
                        },
                        0
                      )}
                    />
                    <Link href={"orders/" + order.id}>
                      <Button>Details</Button>
                    </Link>
                  </div>
                  <div className={styles.deliveryStatus}>
                    <Icon
                      name={statusNames.get(order.delivery_status)?.icon!}
                    />
                    {statusNames.get(order.delivery_status)?.title}
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
              ))
            )}
          </div>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
