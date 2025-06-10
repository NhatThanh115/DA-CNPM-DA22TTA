// src/pages/CategoryPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchBooks } from '../services/bookService';
import { Book } from '../types';

export default function CategoryPage() {
  const { category: categoryParam } = useParams<{ category: string }>();
  const { t } = useLanguage();
  const location = useLocation();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');

  const isValidCategory = categoryParam && /^[a-zA-Z0-9-]+$/.test(categoryParam);

  useEffect(() => {
    if (!isValidCategory) return;

    const categoryKey = categoryParam as string;
    const translatedName = t(categoryKey) || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    setCategoryName(translatedName);
    document.title = `${translatedName} ${t('booksText')} | BookHaven`;

    const loadBooks = async () => {
      try {
        setLoading(true);
        const params: any = { category: categoryKey, page: currentPage, limit: 12 };
        const response = await fetchBooks(params);
        setBooks(response.books);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch books for category ${categoryKey}:`, err);
        setError(t('errorFetchingBooks'));
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [t, categoryParam, currentPage, isValidCategory]);

  if (!isValidCategory) {
    return <Navigate to="/categories" replace state={{ error: t('invalidCategory') }} />; // Add translation
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryName} {t('booksText')}</h1>
        <p className="text-gray-600 mt-2">
          {t('discoverCollectionByCategory', { category: categoryName })} {/* Add translation */}
        </p>
        {location.state?.error &&
            <p className="text-red-500 mt-2">{location.state.error}</p>
        }
      </div>

      {loading && <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-2">{t('loading')}...</p></div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <BookList
            books={books}
            showFilters={false} 
          />
           {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                {t('previousPage')}
              </button>
              {[...Array(totalPages).keys()].map(num => (
                <button
                  key={num + 1}
                  onClick={() => handlePageChange(num + 1)}
                  className={`px-4 py-2 border rounded-md ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  {num + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                {t('nextPage')}
              </button>
            </div>
          )}
          {!books.length && <div className="text-center py-10"><p>{t('noBooksInCategory', { category: categoryName })}</p></div>} {/* Add translation */}
        </>
      )}
    </div>
  );
}
