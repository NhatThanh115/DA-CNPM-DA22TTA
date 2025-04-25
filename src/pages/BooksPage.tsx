import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { books } from '../data/books';
import { useLanguage } from '../contexts/LanguageContext';

export default function BooksPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const { t } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = `${t('booksText')} | BookHaven`;
  }, [t]);

  const getCategoryName = (category: string): string => {
    if (category === 'all') return t('allBooks');
    switch (category) {
      case 'fiction': return t('fiction');
      case 'non-fiction': return t('nonFiction');
      case 'sci-fi': return t('sciFi');
      case 'mystery': return t('mystery');
      case 'biography': return t('biography');
      case 'romance': return t('romance');
      case 'history': return t('history');
      case 'self-help': return t('selfHelp');
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {getCategoryName(category)}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('discoverCollection')}
        </p>
      </div>

      <BookList
        books={books}
        showFilters={true}
      />
    </div>
  );
}
