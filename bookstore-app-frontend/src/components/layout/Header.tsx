import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  UserIcon,
  HeartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { cartItems } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    if (isLanguageMenuOpen) setIsLanguageMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const changeLanguage = (lang: 'en' | 'vi') => {
    setLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">BookHaven</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600">{t('home')}</Link>
            <Link to="/books" className="text-gray-600 hover:text-blue-600">{t('books')}</Link>
            <Link to="/categories" className="text-gray-600 hover:text-blue-600">{t('categories')}</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600">{t('about')}</Link>
          </nav>

          {/* Search, Cart, Language, User, and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center border rounded-full px-3 py-1 bg-gray-50">
              <input
                type="text"
                placeholder={t('searchBooks')}
                className="bg-transparent outline-none w-40 lg:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </button>
            </form>

            {/* Language Switcher */}
            <div className="relative">
              <button
                className="flex items-center text-gray-700 hover:text-blue-600"
                onClick={toggleLanguageMenu}
                aria-label="Language selector"
              >
                <GlobeAltIcon className="h-6 w-6" />
                <span className="ml-1 uppercase text-sm font-semibold">{language}</span>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md overflow-hidden z-10">
                  <button
                    className={`w-full px-4 py-2 text-left ${language === 'en' ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </button>
                  <button
                    className={`w-full px-4 py-2 text-left ${language === 'vi' ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => changeLanguage('vi')}
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>

            {/* User Account */}
            {currentUser ? (
              <div className="relative">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600"
                  onClick={toggleUserMenu}
                >
                  <span className="hidden md:block mr-2 text-sm font-medium">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <UserIcon className="h-6 w-6" />
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserIcon className="h-5 w-5 mr-2" />
                      {t('myProfile')}
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5 mr-2" />
                      {t('myFavorites')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                >
                  {t('login')}
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 px-2 py-1"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            <Link to="/cart" className="relative p-2">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={toggleMenu}>
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <form onSubmit={handleSearch} className="flex items-center border rounded-full px-3 py-1 mb-4 bg-gray-50">
              <input
                type="text"
                placeholder={t('searchBooks')}
                className="bg-transparent outline-none flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="p-1">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </button>
            </form>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('home')}</Link>
              <Link to="/books" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('books')}</Link>
              <Link to="/categories" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('categories')}</Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('about')}</Link>

              {currentUser ? (
                <>
                  <div className="pt-2 border-t mt-2">
                    <div className="font-medium text-gray-700 mb-2">{currentUser.name}</div>
                    <Link to="/profile" className="text-gray-600 hover:text-blue-600 py-2 flex" onClick={toggleMenu}>
                      <UserIcon className="h-5 w-5 mr-2" />
                      {t('myProfile')}
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-blue-600 py-2 flex" onClick={toggleMenu}>
                      <HeartIcon className="h-5 w-5 mr-2" />
                      {t('myFavorites')}
                    </Link>
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800 py-2 flex w-full text-left">
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t mt-2">
                  <div className="font-medium text-gray-600 mb-2">{t('account')}</div>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('login')}</Link>
                  <Link to="/register" className="text-gray-600 hover:text-blue-600 py-2" onClick={toggleMenu}>{t('register')}</Link>
                </div>
              )}

              <div className="py-2 border-t mt-2">
                <div className="font-medium text-gray-600 mb-2">Language / Ngôn ngữ</div>
                <div className="flex space-x-4">
                  <button
                    className={`px-3 py-1 ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded`}
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </button>
                  <button
                    className={`px-3 py-1 ${language === 'vi' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded`}
                    onClick={() => changeLanguage('vi')}
                  >
                    Tiếng Việt
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
