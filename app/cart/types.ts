interface Cart {
  id: number;
  quantity: number;
  selected: boolean;
}

interface Product {
  id: number | null;
  title: string;
  url: string;
  list_price: number;
  stock_quantity: number;
  images: string[];
  cart: Cart;
}
