export interface Category {
  id: string;
  title: string;
  type:"PRODUCT" | "EXPENSE" | "BOTH"
  // slug: string;
}


export interface Product {
  id: string;
  title: string;
  price: number;
  stock?: number;
  isPrepared: boolean;
  category: Category;
  images?: { url: string }[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  notes?: string;
  product: Product;
}

export interface Order {
  id: string;
  status: 'OPEN' | 'PAID' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  table: {
    id: string;
    tableNumber: string | number;
    status: "AVAILABLE" | 'OCCUPIED' | 'RESERVED' | 'INACTIVE'
  };
}

export interface AdminOrderOpen{
   id: string;
  status: 'OPEN' | 'PAID' | 'CANCELLED';
  total: number;
  items: OrderItem[];
  table: {
    id: string;
    number: string | number;
    status: "AVAILABLE" | 'OCCUPIED' | 'RESERVED' | 'INACTIVE'
  };
}

export interface DraftItem {
  product: Product;
  quantity: number;
  notes?: string;
}