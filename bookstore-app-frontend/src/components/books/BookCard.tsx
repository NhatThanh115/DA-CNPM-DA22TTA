import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import type { Book } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import FavoriteButton from './FavoriteButton';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // Format price to 2 decimal places
  const formattedPrice = book.price.toFixed(2);

  // Generate stars based on rating
  const renderRatingStars = () => {
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 >= 0.5;

    return (
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={`star-${book.id}-${i}`}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-yellow-500'
                : i === fullStars && hasHalfStar
                  ? 'text-yellow-500'
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{book.rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleAddToCart = () => {
    addToCart(book, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <Link to={`/books/${book.id}`} className="relative block">
        <div className="h-56 overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2">
          <FavoriteButton bookId={book.id} size="sm" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/books/${book.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 truncate">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{t('by')} {book.author}</p>

        {renderRatingStars()}

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-lg">${formattedPrice}</span>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label={t('addToCart')}
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
