// src/pages/ProfilePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { books as allBooksData } from '../data/books'; // Keep for full book details
import BookCard from '../components/books/BookCard';
import { User } from '../services/authService'; // Ensure this matches the one used in AuthContext

export default function ProfilePage() {
  const {
    currentUser,
    logout,
    loading: authLoading,
    error: authError,
    clearError,
    updateProfile,
    favoriteBooks: favoriteBookIds, // These are IDs from AuthContext
    fetchCurrentUser, // To refresh user data after updates elsewhere
  } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [displayedFavoriteBooks, setDisplayedFavoriteBooks] = useState<typeof allBooksData>([]);
  const [profileLoading, setProfileLoading] = useState(false); // Local loading for profile actions

  useEffect(() => {
    document.title = `${t('myProfile')} | BookHaven`;
    // If not logged in and not in initial auth loading, redirect
    if (!authLoading && !currentUser) {
      navigate('/login');
    }
  }, [authLoading, currentUser, navigate, t]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      // Map favoriteBookIds to full book objects
      const userFavorites = allBooksData.filter(book =>
        favoriteBookIds.includes(book.id) // Assuming frontend book data uses 'id' that matches backend's favorite book ID
      );
      setDisplayedFavoriteBooks(userFavorites);
    } else {
      // Clear fields if user logs out
      setName('');
      setUsername('');
      setDisplayedFavoriteBooks([]);
    }
  }, [currentUser, favoriteBookIds]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setProfileLoading(true);
    clearError(); // Clear previous errors
    try {
      // Only send fields if they are different or if email is allowed to be updated
      const updates: Partial<Omit<User, 'id' | 'favoriteBooks'>> = {};
      if (name !== currentUser.name) updates.name = name;
      if (username !== currentUser.username) updates.username = username;
      // Add email update logic if your backend/UI supports it
      // if (email !== currentUser.email) updates.email = email;

      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
      }
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to update profile on page:', err);
      // Error is already set in AuthContext, or you can set a local error
    } finally {
      setProfileLoading(false);
    }
  };

  // Show main auth loading spinner if initial user fetch is happening
  if (authLoading && !currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{t('myProfile')}</h1>
            <button
                onClick={() => fetchCurrentUser()} // Button to manually refresh user data
                className="px-3 py-1.5 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300"
                disabled={authLoading || profileLoading}
            >
                {authLoading || profileLoading ? t('loading') : t('refresh')}
            </button>
        </div>

        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">{t('error')}: </strong>
            <span className="block sm:inline">{authError}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={profileLoading || authLoading}
                  >
                    {profileLoading ? t('saving') : t('save')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setName(currentUser.name);
                      setUsername(currentUser.username);
                      clearError(); // Clear errors when cancelling edit
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    disabled={profileLoading || authLoading}
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
                <label className="block text-gray-700 font-medium mb-1">
                  {t('email')}
                </label>
                <p className="text-gray-600 bg-gray-50 p-2 rounded">{currentUser.email}</p>
              </div>

              <div>
                <label htmlFor="profileName" className="block text-gray-700 font-medium mb-1">
                  {t('fullName')}
                </label>
                {isEditing ? (
                  <input
                    id="profileName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">{currentUser.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="profileUsername" className="block text-gray-700 font-medium mb-1">
                  {t('username')}
                </label>
                {isEditing ? (
                  <input
                    id="profileUsername"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">{currentUser.username}</p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={authLoading}
              >
                {authLoading ? t('loggingOut') : t('logout')}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">{t('myFavorites')}</h2>
          {displayedFavoriteBooks.length === 0 ? (
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
              {displayedFavoriteBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
