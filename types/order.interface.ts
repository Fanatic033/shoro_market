
export interface IOrderProduct {
    guid: string;
    price: number;
    quantity: number;
  }
  
  export interface IOrderClient {
    guid: string;
    name: string;
    address: string;
    phone: string;
  }
  
  export interface ICreateOrderPayload {
    userId: number;
    client: IOrderClient;
    date: string; 
    payment: number; // 0 = наличные, 1 = карта и т.д.
    description?: string;
    contactPhone: string;
    deliveryAddress: string;
    products: IOrderProduct[];
  }