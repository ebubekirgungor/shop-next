interface Address {
  id: number | null;
  title: string;
  customer_name: string;
  address: string;
}

interface Category {
  id?: number;
  title: string;
  url: string;
  filters: string[];
  image?: string;
}

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
  cart?: Cart;
  is_favorite?: boolean;
}

enum Role {
  USER,
  ADMIN,
}

interface User {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  birth_date: {
    day: string;
    month: string;
    year: string;
  };
  gender?: string;
  role?: Role;
  password?: string;
}

enum DeliveryStatus {
  DELIVERED,
  IN_PROGRESS,
  RETURNED,
  CANCELED,
}

interface OrderProduct {
  title: string;
  url: string;
  list_price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: number;
  created_at: Date;
  total_amount: number;
  customer_name: string;
  delivery_address: string;
  delivery_status: DeliveryStatus;
  products: OrderProduct[];
}
