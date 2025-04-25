import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookDetail from '../components/books/BookDetail';
import { getBookById } from '../data/books';
import { useLanguage } from '../contexts/LanguageContext';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const book = id ? getBookById(id) : undefined;

  useEffect(() => {
    if (!book) {
      navigate('/books', { replace: true });
    } else {
      document.title = `${book.title} | ${t('BookHaven')}`;
    }
  }, [book, navigate, t]);

  if (!book) {
    return null; // This will be redirected in the useEffect
  }

  return (
    <div>
      <BookDetail book={book} />
    </div>
  );
}
