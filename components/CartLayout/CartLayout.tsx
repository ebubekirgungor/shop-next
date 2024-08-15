import Link from "next/link";
import Button from "../Button";
import styles from "./CartLayout.module.css";

export default function CartLayout({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const shipping = 50;
  return (
    <>
      {children}
      {products.length > 0 && (
        <div className={styles.checkoutBox}>
          Selected items (
          {products.reduce((total: number, product: Product) => {
            return (
              total + (product?.cart?.selected ? product.cart.quantity : 0)
            );
          }, 0)}
          )
          <div className={styles.price}>
            {products.reduce((total: number, product: Product) => {
              return (
                total +
                product.list_price *
                  (product?.cart?.selected ? product.cart.quantity : 0)
              );
            }, 0) + shipping}
            <span> TL</span>
          </div>
          <div className={styles.column}>
            <div className={styles.detail}>
              Subtotal
              <div>
                {products.reduce((total: number, product: Product) => {
                  return (
                    total +
                    product.list_price *
                      (product?.cart?.selected ? product.cart.quantity : 0)
                  );
                }, 0)}
                <span> TL</span>
              </div>
            </div>
            <div className={styles.detail}>
              Shipping
              <div>
                {shipping}
                <span> TL</span>
              </div>
            </div>
          </div>
          <Link href="/checkout">
            <Button type="button">Checkout</Button>
          </Link>
        </div>
      )}
    </>
  );
}
