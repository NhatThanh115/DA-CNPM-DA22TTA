import { useState } from 'react';
import type { Book, Category } from '../../types';
import BookCard from './BookCard';
import { useLanguage } from '../../contexts/LanguageContext';

interface BookListProps {
  books: Book[];
  title?: string;
  showFilters?: boolean;
}

export default function BookList({ books, title, showFilters = false }: BookListProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Get unique categories from books
  const categories: Category[] = ['all', ...Array.from(new Set(books.map(book => book.category))) as Category[]];

  // Filter books by category
  const filteredBooks = selectedCategory === 'all'
    ? books
    : books.filter(book => book.category === selectedCategory);

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      {showFilters && (
        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="sm:w-1/2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              {t('filterByCategory')}
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all'
                    ? t('all')
                    : category === 'non-fiction'
                      ? t('nonFiction')
                      : category === 'sci-fi'
                        ? t('sciFi')
                        : category === 'self-help'
                          ? t('selfHelp')
                          : t(category)}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-1/2">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              {t('sortBy')}
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="default">{t('featured')}</option>
              <option value="price-low">{t('priceLowToHigh')}</option>
              <option value="price-high">{t('priceHighToLow')}</option>
              <option value="rating">{t('rating')}</option>
              <option value="newest">{t('newestArrivals')}</option>
            </select>
          </div>
        </div>
      )}

      {sortedBooks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noBooksFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
