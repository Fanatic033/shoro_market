import { Ionicons } from '@expo/vector-icons';
import { create } from 'zustand';

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  image: any;
  isNew?: boolean;
  isHit?: boolean;
  discount?: number;
  category: string;
  description?: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
  bgColor: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  sortBy: 'default' | 'price_asc' | 'price_desc' | 'name' | 'newest';
  
  // Actions
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'default' | 'price_asc' | 'price_desc' | 'name' | 'newest') => void;
  getFilteredProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [
    {
      id: 1,
      title: "ШОРО Чалап Классический 0.5л",
      price: 65,
      originalPrice: 75,
      image: require("../assets/images/shoro1.png"),
      isNew: true,
      category: 'popular',
      description: 'Традиционный напиток из кисломолочных продуктов',
      inStock: true
    },
    {
      id: 2,
      title: "ШОРО Айран Традиционный 0.5л",
      price: 60,
      image: require("../assets/images/shoro.png"),
      isHit: true,
      isNew: true,
      category: 'popular',
      description: 'Натуральный айран с традиционным вкусом',
      inStock: true
    },
    {
      id: 3,
      title: "ШОРО Боза Домашняя 0.5л",
      price: 80,
      originalPrice: 90,
      image: require("../assets/images/shoro2.png"),
      discount: 11,
      category: 'hits',
      description: 'Домашний квас из ржаного хлеба',
      inStock: true
    },
    {
      id: 4,
      title: "ШОРО Тан с мятой 0.5л",
      price: 70,
      image: require("../assets/images/shoro1.png"),
      isNew: true,
      category: 'new',
      description: 'Освежающий тан с добавлением мяты',
      inStock: true
    },
    {
      id: 5,
      title: "ШОРО Минералка Газ. 1л",
      price: 85,
      originalPrice: 95,
      image: require("../assets/images/shoro2.png"),
      isHit: true,
      category: 'hits',
      description: 'Газированная минеральная вода',
      inStock: true
    },
    {
      id: 6,
      title: "ШОРО Лимонад Дюшес 0.5л",
      price: 90,
      image: require("../assets/images/shoro1.png"),
      category: 'popular',
      description: 'Освежающий лимонад с грушевым вкусом',
      inStock: true
    },
    {
      id: 7,
      title: "ШОРО Квас Белый 0.5л",
      price: 95,
      originalPrice: 105,
      image: require("../assets/images/shoro.png"),
      isNew: true,
      category: 'new',
      description: 'Белый квас с мягким вкусом',
      inStock: true
    },
    {
      id: 8,
      title: "ШОРО Компот Абрикос 1л",
      price: 120,
      image: require("../assets/images/shoro1.png"),
      category: 'popular',
      description: 'Сладкий компот из абрикосов',
      inStock: true
    },
  ],

  categories: [
    {
      id: 'popular',
      title: 'Популярное',
      iconName: 'flame',
      gradient: ['#DC143C', '#B22222'],
      bgColor: '#FFFFFF'
    },
    {
      id: 'new',
      title: 'Новинки',
      iconName: 'sparkles',
      gradient: ['#000000', '#333333'],
      bgColor: '#F8F8F8'
    },
    {
      id: 'hits',
      title: 'Хиты продаж',
      iconName: 'star',
      gradient: ['#DC143C', '#B22222'],
      bgColor: '#FFFFFF'
    }
  ],

  selectedCategory: 'popular',
  searchQuery: '',
  sortBy: 'default',

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  getFilteredProducts: () => {
    const { products, selectedCategory, searchQuery, sortBy } = get();
    
    let filtered = products;
    
    // Фильтр по категории
    if (selectedCategory !== 'popular') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Фильтр по поиску
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // По умолчанию: сначала новинки, потом хиты, потом остальные
        filtered = [...filtered].sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.isHit && !b.isHit) return -1;
          if (!a.isHit && b.isHit) return 1;
          return 0;
        });
    }
    
    return filtered;
  },

  getProductsByCategory: (category) => {
    return get().products.filter(p => p.category === category);
  },

  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },
}));
