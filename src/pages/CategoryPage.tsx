import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { getBooksByCategory } from '../data/books';
import type { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t } = useLanguage();

  // Validate category
  const validCategories: Category[] = ['fiction', 'non-fiction', 'sci-fi', 'mystery', 'biography', 'romance', 'history', 'self-help'];
  const isValidCategory = category && validCategories.includes(category as Category);

  const books = isValidCategory ? getBooksByCategory(category) : [];

  // Redirect if invalid category
  if (!isValidCategory) {
    return <Navigate to="/books" replace />;
  }

  // Get translated category name
  const getCategoryName = (categoryKey: string): string => {
    switch (categoryKey) {
      case 'fiction': return t('fiction');
      case 'non-fiction': return t('nonFiction');
      case 'sci-fi': return t('sciFi');
      case 'mystery': return t('mystery');
      case 'biography': return t('biography');
      case 'romance': return t('romance');
      case 'history': return t('history');
      case 'self-help': return t('selfHelp');
      default: return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    }
  };

  const categoryName = category ? getCategoryName(category) : '';

  // Set page title
  useEffect(() => {
    document.title = `${categoryName} ${t('booksText')} | BookHaven`;
  }, [categoryName, t]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryName} {t('booksText')}</h1>
        <p className="text-gray-600 mt-2">{t('discoverCollection')}</p>
      </div>

      {books.length > 0 ? (
        <BookList
          books={books}
          title={`${t('all')} ${categoryName} ${t('booksText')}`}
          showFilters={true}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{t('noBooksFound')}</p>
        </div>
      )}
    </div>
  );
}
