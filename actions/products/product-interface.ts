
export interface ProductImage {
  id?: string;
  url: string;
}

export interface Product {
  id: string;
  title: string;
  price?: number;
  slug: string;
  sizes: string[];
  is_prepared: boolean;
  is_active: boolean;
  stock?: number;
  category: {
    id: string;
    title: string;
    type?: string;
  };
  images: ProductImage[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsFilterParams {
  limit?: number;
  offset?: number;
  search?: string;
  categoryId?: string;
}

export interface PaginatedProductsResponse {
  total: number;
  limit: number;
  offset: number;
  products: Product[];
}



