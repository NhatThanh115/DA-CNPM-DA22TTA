// Instructions: Refactor BooksPage to fetch books from the backend with pagination and category filter

// src/pages/BooksPage.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchBooks } from '../services/bookService';
import { Book } from '../types';

export default function BooksPage() {
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category') || 'all'; // Category from URL query param
  const { t } = useLanguage();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = `${t('booksText')} | BookHaven`;
  }, [t]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const params: any = { page: currentPage, limit: 12 }; // Example limit
        if (categoryQuery && categoryQuery !== 'all') {
          params.category = categoryQuery;
        }
        // Add sorting params if your BookList component passes them up or if static here
        // params.sortBy = 'createdAt';
        // params.order = 'desc';

        const response = await fetchBooks(params);
        setBooks(response.books);
        setTotalPages(response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setError(t('errorFetchingBooks'));
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [t, categoryQuery, currentPage]);

  const getPageTitle = (categoryKey: string): string => {
    if (categoryKey === 'all' || !categoryKey) return t('allBooks');
    // Attempt to translate common category keys; otherwise, capitalize
    const knownCategories: Record<string, string> = {
        'fiction': t('fiction'),
        'non-fiction': t('nonFiction'),
        'sci-fi': t('sciFi'),
        'mystery': t('mystery'),
        'biography': t('biography'),
        'romance': t('romance'),
        'history': t('history'),
        'self-help': t('selfHelp')
    };
    return knownCategories[categoryKey.toLowerCase()] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top or to the book list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {getPageTitle(categoryQuery)}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('discoverCollection')}
        </p>
      </div>

      {loading && <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p className="mt-2">{t('loading')}...</p></div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}
      {!loading && !error && (
        <>
          <BookList
            books={books}
            showFilters={true} // BookList filters are client-side based on `books` prop for now
                               // To make them server-side, BookList would need to trigger API calls
          />
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                {t('previousPage')} {/* Add translation */}
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
                {t('nextPage')} {/* Add translation */}
              </button>
            </div>
          )}
          {!books.length && <div className="text-center py-10"><p>{t('noBooksFound')}</p></div>}
        </>
      )}
    </div>
  );
}
