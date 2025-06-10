// src/pages/BookDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookDetail from '../components/books/BookDetail';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchBookById } from '../services/bookService';
import { Book } from '../types';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        setError(t('invalidBookId'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedBook = await fetchBookById(id);
        setBook(fetchedBook);
        document.title = `${fetchedBook.title} | BookHaven`;
        setError(null);
      } catch (err: any) {
        console.error(`Failed to fetch book with ID ${id}:`, err);
        if (err.response && err.response.status === 404) {
            setError(t('bookNotFound')); 
        } else {
            setError(t('errorFetchingBook')); 
        }
        navigate('/books', { replace: true, state: { error: t('bookNotFound') } });
      } finally {
        setLoading(false);
      }
    };
    loadBook();
  }, [id, navigate, t]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (error || !book) {
  
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-red-600">{error || t('bookCouldNotBeLoaded')}</h1>
            <button onClick={() => navigate('/books')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                {t('backToBooks')}
            </button>
        </div>
    );
  }

  return (
    <div>
      <BookDetail book={book} />
    </div>
  );
}
