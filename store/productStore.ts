import { IProduct } from '@/types/products.interface';
import { Ionicons } from '@expo/vector-icons';
import { create } from 'zustand';

export interface Category {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  bgColor: string;
}

interface ProductState {
  products: IProduct[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'name' | 'newest';
  isLoading?: boolean;
  error?: string | null;
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'default' | 'price_asc' | 'price_desc' | 'name' | 'newest') => void;
  loadRemoteProducts: () => Promise<void>;
  getFilteredProducts: () => IProduct[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],

  categories: [
    {
      id: 'all',
      title: 'Все',
      iconName: 'grid',
      gradient: ['#DC143C', '#B22222'] as [string, string],
      bgColor: '#FFFFFF'
    }
  ],

  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  isLoading: false,
  error: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  loadRemoteProducts: async () => {
    try {
      set({ isLoading: true, error: null });

      const { loadProducts } = await import('../services/products');
      const products = await loadProducts();
      
      // Создаем категории на основе продуктов
      const categoryNames = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
      const mapIcon = (name: string): keyof typeof Ionicons.glyphMap => {
        const lower = name.toLowerCase();
        if (lower.includes('вода')) return 'water';
        if (lower.includes('снеки')) return 'fast-food';
        if (lower.includes('стакан')) return 'cafe';
        if (lower.includes('товар')) return 'pricetags';
        if (lower.includes('бут') || lower.includes('напит')) return 'beer';
        if (lower.includes('проч')) return 'apps';
        // if (lower.includes('нац')) return 'flag';
        return 'pricetag';
      };
      const dynamicCategories: Category[] = [
        {
          id: 'all',
          title: 'Все',
          iconName: 'grid',
          gradient: ['#DC143C', '#B22222'] as [string, string],
          bgColor: '#FFFFFF',
        },
        ...categoryNames.map((name) => ({
          id: name,
          title: name,
          iconName: mapIcon(name),
          gradient: ['#000000', '#333333'] as [string, string],
          bgColor: '#F8F8F8',
        })),
      ];

      set({ products, categories: dynamicCategories, selectedCategory: 'all', isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Failed to load products' });
    }
  },

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery, sortBy } = get();
    
    let filtered = products;
    
    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Сортировка
    switch (sortBy) {
      case 'price_asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        filtered = [...filtered];
        break;
      default:
        // По умолчанию: без изменения порядка
        filtered = [...filtered];
    }
    
    return filtered;
  },
}));
