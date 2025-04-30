import { useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  bookId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function FavoriteButton({
  bookId,
  className = '',
  size = 'md',
  showText = false
}: FavoriteButtonProps) {
  const { currentUser, isBookInFavorites, addToFavorites, removeFromFavorites, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(() => isBookInFavorites(bookId));
  const [isLoading, setIsLoading] = useState(false);

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-3' : 'p-2';

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);

      if (isFavorite) {
        await removeFromFavorites(bookId);
        setIsFavorite(false);
      } else {
        await addToFavorites(bookId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`rounded-full ${buttonSize} ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      } transition-colors relative ${className} disabled:opacity-50`}
      onClick={toggleFavorite}
      disabled={isLoading || loading}
      aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
    >
      {isFavorite ? (
        <HeartSolid className={iconSize} />
      ) : (
        <HeartOutline className={iconSize} />
      )}

      {showText && (
        <span className="ml-1">
          {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
        </span>
      )}

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-ping w-2 h-2 rounded-full bg-red-400 opacity-75" />
        </span>
      )}
    </button>
  );
}
