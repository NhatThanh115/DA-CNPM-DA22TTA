import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { books } from '../data/books';
import BookCard from '../components/books/BookCard';
import { User } from '../services/authService';

export default function ProfilePage() {
  const { currentUser, logout, loading, error, clearError, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState<typeof books>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser && !loading) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  // Set initial form values
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);

      // Get favorite books
      const userFavorites = books.filter(book =>
        currentUser.favoriteBooks.includes(book.id)
      );
      setFavoriteBooks(userFavorites);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      await updateProfile({
        ...currentUser,
        name,
        username
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('myProfile')}</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 relative">
            <button
              onClick={clearError}
              className="absolute right-2 top-2 text-red-400 hover:text-red-600"
            >
              ×
            </button>
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{t('accountDetails')}</h2>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (currentUser) {
                        setName(currentUser.name);
                        setUsername(currentUser.username);
                      }
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {t('edit')}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('email')}
                </label>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('fullName')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{currentUser.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('username')}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{currentUser.username}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">{t('myFavorites')}</h2>

          {favoriteBooks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">{t('noFavorites')}</p>
              <button
                onClick={() => navigate('/books')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('browseCatalog')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
