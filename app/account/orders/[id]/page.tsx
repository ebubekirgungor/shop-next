"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import LayoutContainer from "@/components/LayoutContainer";
import LayoutBox from "@/components/LayoutBox";
import LayoutTitle from "@/components/LayoutTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import Icon from "@/components/Icon";
import Link from "next/link";
import Box from "@/components/Box";
import Image from "next/image";
import { dateOptions, statusNames } from "../page";
import { DeliveryStatus } from "@/lib/enums";

const shipping = 50;

export default function Order({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/" + params.id)
      .then((response) => response.json())
      .then((data) => {
        data.delivery_status = DeliveryStatus[data.delivery_status];
        setOrder(data);
        setLoading(false);
      });
  }, []);

  return (
    <LayoutContainer>
      <LayoutTitle style={{ paddingLeft: "1rem" }}>
        <Link href={"/account/orders"} className={styles.previousButton}>
          <Icon name="previous" />
        </Link>
        Order detail
        {!isLoading && (
          <div className={styles.grayText}>
            {new Date(order!.created_at).toLocaleString("tr-TR", dateOptions)}
          </div>
        )}
      </LayoutTitle>
      <LayoutBox minHeight="825px">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className={styles.column}>
            <Box className={styles.box}>
              <div className={styles.boxHeader}>Items</div>
              <div className={styles.deliveryStatus}>
                <Icon name={statusNames[order?.delivery_status! + 1].icon} />
                {statusNames[order?.delivery_status! + 1].title}
              </div>
              <div className={styles.orderProducts}>
                {order?.products.map((product: OrderProduct) => (
                  <div className={styles.product} key={product.url}>
                    <Link href={"/product/" + product.url}>
                      <Image
                        src={"/images/products/" + product.image}
                        alt={product.image}
                        width="0"
                        height="0"
                        sizes="14rem"
                      />
                      <div className={styles.title}>{product.title}</div>
                    </Link>
                    <div className={styles.justifyBetween}>
                      <div className={styles.price}>
                        {product.list_price} TL
                      </div>
                      <div className={styles.grayText}>
                        Quantity: {product.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
            <div className={styles.row}>
              <Box className={styles.box}>
                <div className={styles.boxHeader}>Shipment</div>
                <div className={styles.shipmentBox}>
                  <div>
                    <div className={styles.grayText}>Customer</div>
                    {order?.customer_name}
                  </div>
                  <div>
                    <div className={styles.grayText}>Address</div>
                    {order?.delivery_address}
                  </div>
                </div>
              </Box>
              <Box className={styles.box}>
                <div className={styles.boxHeader}>Payment</div>
                <div className={styles.paymentBox}>
                  <div className={styles.info}>
                    <div className={styles.grayText}>Subtotal</div>
                    {order?.total_amount} TL
                  </div>
                  <div className={styles.info}>
                    <div className={styles.grayText}>Shipping cost</div>
                    {shipping} TL
                  </div>
                  <div className={styles.info}>
                    <div className={styles.grayText}>Total charge</div>
                    {order?.total_amount! + shipping} TL
                  </div>
                </div>
              </Box>
            </div>
          </div>
        )}
      </LayoutBox>
    </LayoutContainer>
  );
}
