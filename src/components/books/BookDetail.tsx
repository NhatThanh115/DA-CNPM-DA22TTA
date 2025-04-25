import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { Book } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface BookDetailProps {
  book: Book;
}

export default function BookDetail({ book }: BookDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  // Format date: "2019-02-05" -> "February 5, 2019"
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(t('language') === 'vi' ? 'vi-VN' : 'en-US', options);
  };

  // Generate full stars for rating
  const renderRatingStars = () => {
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={`detail-star-${book.id}-${index}`}
            className={`w-5 h-5 ${
              index < fullStars
                ? 'text-yellow-500'
                : index === fullStars && hasHalfStar
                ? 'text-yellow-500'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-gray-600">{book.rating.toFixed(1)}</span>
      </div>
    );
  };

  // Translate category name
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'fiction': return t('fiction');
      case 'non-fiction': return t('nonFiction');
      case 'sci-fi': return t('sciFi');
      case 'mystery': return t('mystery');
      case 'biography': return t('biography');
      case 'romance': return t('romance');
      case 'history': return t('history');
      case 'self-help': return t('selfHelp');
      default: return category;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        {t('backToBooks')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Book Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{t('by')} {book.author}</p>

          {renderRatingStars()}

          <div className="my-6">
            <div className="text-2xl font-bold text-blue-600 mb-1">${book.price.toFixed(2)}</div>
            <div className={`text-sm ${book.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {book.inStock ? t('inStock') : t('outOfStock')}
            </div>
          </div>

          <div className="my-6">
            <h3 className="font-semibold mb-2">{t('description')}</h3>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          <div className="border-t border-b py-4 my-6">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="font-semibold">{t('category')}</span>{' '}
                <Link to={`/categories/${book.category}`} className="text-blue-600 hover:underline">
                  {getCategoryName(book.category)}
                </Link>
              </div>
              <div>
                <span className="font-semibold">{t('published')}</span> {formatDate(book.publicationDate)}
              </div>
            </div>
          </div>

          {book.inStock && (
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 border-r hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 border-l hover:bg-gray-100"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {t('addToCart')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
