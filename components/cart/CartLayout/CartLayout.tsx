import styles from "./CartLayout.module.css";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { updateCart } from "@/lib/utils";
import { jsonFetcher } from "@/lib/fetchers";
import { toast } from "react-toastify";

import { Button } from "@/components/ui";

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
    const response = await jsonFetcher("/api/orders", "POST", {
      address_id: selectedAddress,
    });

    if (response.status === 200) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  }

  return (
    <>
      {children}
      <div
        className={`${styles.checkoutBox} ${
          products.length === 0 && styles.hide
        }`}
      >
        {products.length > 0 ? (
          <>
            <div className={styles.section}>
              <div className={styles.title}>
                <button className={styles.expandButton} type="button" />
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
              </div>
              <div className={styles.price}>
                {(
                  products.reduce((total: number, product: Product) => {
                    return (
                      total +
                      product.list_price *
                        (product?.cart?.selected ? product.cart.quantity : 0)
                    );
                  }, 0) + shipping
                ).toLocaleString("tr-TR")}
                <span> TL</span>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.column}>
                <div className={styles.detail}>
                  Subtotal
                  <div>
                    {products
                      .reduce((total: number, product: Product) => {
                        return (
                          total +
                          product.list_price *
                            (product?.cart?.selected
                              ? product.cart.quantity
                              : 0)
                        );
                      }, 0)
                      .toLocaleString("tr-TR")}
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
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}
