import axiosApi from '@/utils/instance';

export type RawCatalogProduct = {
  guid: string;
  name: string;
  value: number | null;
  weight: number | null;
  inpackage: number | null;
  productCategory: string;
};

export type RawPriceItem = {
  id: number;
  name: string;
  price: number;
};

export type PriceListResponse = {
  client: { id: number; name: string };
  products: RawPriceItem[];
};

export type MergedProduct = {
  id: number; // use price list id for cart stability
  title: string;
  price: number;
  guid?: string;
  category: string;
  image: any;
  inStock: boolean;
  inpackage?: number | null;
};

const PRODUCTS_URL = 'https://crmdev.shoro.kg/api/product/forNurs';
const PRICES_URL = 'https://crmdev.shoro.kg/api/pricelist/findByClient?clientId=4808';

export async function fetchCatalog(): Promise<RawCatalogProduct[]> {
  const { data } = await axiosApi.get<RawCatalogProduct[]>(PRODUCTS_URL, { withCredentials: true });
  return data || [];
}

export async function fetchPriceList(): Promise<PriceListResponse> {
  const { data } = await axiosApi.get<PriceListResponse>(PRICES_URL, { withCredentials: true });
  return data;
}

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

export async function loadAndMergeProducts(): Promise<MergedProduct[]> {
  const [catalog, priceList] = await Promise.all([fetchCatalog(), fetchPriceList()]);

  const nameToCatalog = new Map<string, RawCatalogProduct>();
  catalog.forEach(p => nameToCatalog.set(p.name.trim(), p));

  const merged: MergedProduct[] = priceList.products.map(p => {
    const match = nameToCatalog.get(p.name.trim());
    const image = pickLocalImageByName(p.name);
    const inpackage = match?.inpackage ?? null;
    // Keep price as unit price; cart will account for package size
    return {
      id: p.id,
      title: p.name,
      price: p.price,
      guid: match?.guid,
      category: match?.productCategory || 'popular',
      image,
      inStock: true,
      inpackage,
    };
  });

  return merged;
}


