// Instructions: Refactor FavoriteButton to use updated AuthContext and handle async operations

// src/components/books/FavoriteButton.tsx
import { useState, useEffect } from 'react';
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
  const { currentUser, isBookInFavorites, addToFavorites, removeFromFavorites, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Local loading state for this button

  useEffect(() => {
    if (currentUser) {
      setIsFavorite(isBookInFavorites(bookId));
    }
  }, [currentUser, bookId, isBookInFavorites]);

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  const buttonSize = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-3' : 'p-2';

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(bookId);
        // Local state will be updated by useEffect due to currentUser change
      } else {
        await addToFavorites(bookId);
        // Local state will be updated by useEffect due to currentUser change
      }
    } catch (err) {
      console.error('Failed to toggle favorite from button:', err);
      // Optionally show a toast or local error message here
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
      disabled={isLoading || authLoading} // Disable if this button is loading OR auth context is loading
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

      {(isLoading || authLoading) && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-ping w-2 h-2 rounded-full bg-red-400 opacity-75" />
        </span>
      )}
    </button>
  );
}
