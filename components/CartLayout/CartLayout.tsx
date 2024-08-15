import Link from "next/link";
import Button from "../Button";
import styles from "./CartLayout.module.css";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import { updateCart } from "@/lib/utils";

export default function CartLayout({
  products,
  selectedAddress,
  children,
}: {
  products: Product[];
  selectedAddress?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const shipping = 50;
  const isCart = usePathname() === "/cart";

  async function goToCheckout() {
    await updateCart(products);
    router.push("/checkout");
  }

  async function placeOrder() {
    await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_id: selectedAddress,
      }),
    });
  }

  return (
    <>
      {children}
      <div className={styles.checkoutBox}>
        {products.length > 0 ? (
          <>
            {isCart ? (
              <>
                Selected items (
                {products.reduce((total: number, product: Product) => {
                  return (
                    total +
                    (product?.cart?.selected ? product.cart.quantity : 0)
                  );
                }, 0)}
                )
              </>
            ) : (
              <>Total amount</>
            )}
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
            {isCart ? (
              <Button type="button" onClick={goToCheckout}>
                Checkout
              </Button>
            ) : (
              <Button
                type="button"
                onClick={placeOrder}
                disabled={!selectedAddress}
              >
                Place Order
              </Button>
            )}
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}
