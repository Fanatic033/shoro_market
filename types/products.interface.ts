
export type IProduct = {
  url: string | null;
  image?: string | number | { uri: string } | null;
  productId: number;
  guid: string
  productName: string;
  price: number;
  oldPrice: string
  category:string;
  inPackage: string
  };

export type ProductResponse = {
    url: string | null;
    productId: number;
    guid: string
    productName: string;
    price: number;
    oldPrice: string
    category:string;
    inPackage: string
  };
  