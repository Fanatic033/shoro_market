
export type IProduct = {
    id: number;
    title: string;
    guid: string;
    price: number;
    image: any;
    category: string;
    inStock: boolean;
    url?: string | null;
    isNew?: boolean;
    discount?: number;
    originalPrice?: number;
  };

export type ProductResponse = {
    url: string | null;
    productId: number;
    productName: string;
    price: number;
    category:string
    guid: string
  };
  