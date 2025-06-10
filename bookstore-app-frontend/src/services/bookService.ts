// src/services/bookService.ts
import apiClient from '../utils/api';
import { Book as BookType } from '../types'; 

export interface BookApiResponse {
  books: BookType[];
  currentPage: number;
  totalPages: number;
  totalBooks: number;
}

export const fetchBooks = async (params: {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
} = {}): Promise<BookApiResponse> => {
  const response = await apiClient.get<BookApiResponse>('/books', { params });

  response.data.books = response.data.books.map(book => ({ ...book, id: (book as any)._id || book.id }));
  return response.data;
};

export const fetchBookById = async (id: string): Promise<BookType> => {
  const response = await apiClient.get<BookType>(`/books/${id}`);

  response.data.id = (response.data as any)._id || response.data.id;
  return response.data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/books/categories');
  return response.data;
};

