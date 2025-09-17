import { useAuthStore } from '@/store';
import { IProduct, ProductResponse } from '@/types/products.interface';
import { SERVER_URL } from '@/utils/constants/constant';
import axiosApi from '@/utils/instance';
import { getUserIdFromToken } from '@/utils/jwt-decode';

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
export async function loadProducts(): Promise<IProduct[]> {
  const products = await fetchProducts();
  
  return products.map(product => {
    const image = normalizeImageUrl(product.url);
    
    return {
      productId: product.productId,
      productName: product.productName,
      guid: product.guid,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category,
      image,
      url: product.url,
      inPackage: product.inPackage
    };
  });
}

function isAbsoluteUrl(url?: string | null): boolean {
  if (!url) return false;
  return /^https?:\/\//i.test(url);
}

function getAxiosBaseOrigin(): string | null {
  const baseURL = (axiosApi as any)?.defaults?.baseURL as string | undefined;
  if (!baseURL) return null;
  try {
    const u = new URL(baseURL);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  const baseTrimmed = base.replace(/\/$/, '');
  const pathTrimmed = path.replace(/^\//, '');
  return `${baseTrimmed}/${pathTrimmed}`;
}

// Функция для выбора локального изображения по названию продукта или сборки удалённого URL
function normalizeImageUrl(url: string | null) {
  if (url && isAbsoluteUrl(url)) {
    return { uri: url } as const;
  }
  if (url) {
    const origin = getAxiosBaseOrigin() || SERVER_URL;
    return { uri: joinUrl(origin, url) } as const;
  }
  return pickLocalImageByName('');
}

// Функция для выбора локального изображения по названию продукта
function pickLocalImageByName(name: string) {
  const lower = (name || '').toLowerCase();
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