import { useAuthStore } from '@/store';
import axiosApi from '@/utils/instance';
import { getUserIdFromToken } from '@/utils/jwt-decode';

export type ProductResponse = {
  url: string | null;
  productId: number;
  productName: string;
  price: number;
  category:string
  guid: string
};

export type Product = {
  id: number;
  title: string;
  price: number;
  image: any;
  category: string;
  inStock: boolean;
  url?: string | null;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
};
export async function fetchProducts(): Promise<ProductResponse[]> {
  const user = useAuthStore.getState().user;
  const userId = user?.accessToken ? getUserIdFromToken(user.accessToken) : undefined;
  

  const params: Record<string, any> = {};
  if (userId) {
    params.userId = userId;
  }

  const { data } = await axiosApi.get<ProductResponse[]>('/products', {
    params,
  });

  
  return data || [];
}

// Функция для преобразования ответа API в формат приложения
export async function loadProducts(): Promise<Product[]> {
  const products = await fetchProducts();
  
  return products.map(product => {
    const image = product.url 
      ? { uri: `http://192.168.8.207:8080${product.url}` }
      : pickLocalImageByName(product.productName);
    
    return {
      id: product.productId,
      title: product.productName,
      price: product.price,
      category: product.category,
      image,
      inStock: true,
      url: product.url,
    };
  });
}

// Функция для выбора локального изображения по названию продукта
function pickLocalImageByName(name: string) {
  const lower = name.toLowerCase();
  try {
    if (lower.includes('квас')) return require('../assets/images/shoro.png');
    if (lower.includes('тан')) return require('../assets/images/shoro1.png');
    if (lower.includes('вода') || lower.includes('легенда')) return require('../assets/images/shoro2.png');
    if (lower.includes('стакан')) return require('../assets/images/shoro1.png');
    return require('../assets/images/shoro.png');
  } catch {
    return null;
  }
}