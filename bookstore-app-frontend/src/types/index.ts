export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  featured: boolean;
  inStock: boolean;
  publicationDate: string; 
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type Category = 'fiction' | 'non-fiction' | 'sci-fi' | 'mystery' | 'biography' | 'romance' | 'history' | 'self-help' | 'all';
