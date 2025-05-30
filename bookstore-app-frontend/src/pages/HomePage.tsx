// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import BookList from '../components/books/BookList';
import { useLanguage } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { fetchBooks } from '../services/bookService';
import { Book } from '../types';

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'BookHaven';
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        const response = await fetchBooks({ featured: true, limit: 4 });
        setFeaturedBooks(response.books);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch featured books:', err);
        setError(t('errorFetchingBooks')); // Add this translation key
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedBooks();
  }, [t]);

  // Category card data - images are static for now
  const categories = [
    { titleKey: 'fiction', image: "https://images.unsplash.com/photo-1495640388908-05fa85288e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'nonFiction', translationKey: 'non-fiction', image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'sciFi', translationKey: 'sci-fi', image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'mystery', image: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'biography', image: "https://images.unsplash.com/photo-1529473814998-077b4fec6770?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'romance', image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'history', image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
    { titleKey: 'selfHelp', translationKey: 'self-help', image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('discoverBooks')}
            </h1>
            <p className="text-xl mb-8">
              {t('findBooks')}
            </p>
            <Link
              to="/books"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-md font-medium inline-flex items-center transition-colors"
            >
              {t('browseCollection')}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('featuredBooks')}</h2>
            <Link
              to="/books"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              {t('viewAllBooks')}
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {loading && <div className="text-center py-4">{t('loading')}...</div>} {/* Add t('loading') */}
          {error && <div className="text-center py-4 text-red-500">{error}</div>}
          {!loading && !error && featuredBooks.length > 0 && <BookList books={featuredBooks} />}
          {!loading && !error && featuredBooks.length === 0 && <div className="text-center py-4">{t('noFeaturedBooks')}</div>} {/* Add t('noFeaturedBooks') */}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('browseByCategory')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat.titleKey}
                title={t(cat.titleKey)}
                translationKey={cat.translationKey || cat.titleKey}
                image={cat.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - remains the same */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('stayUpdated')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('newsletterText')}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder={t('emailAddress')}
              className="flex-grow px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// Helper component for category cards
function CategoryCard({ title, translationKey, image }: { title: string; translationKey?: string; image: string }) {
  const categoryKey = translationKey || title.toLowerCase(); // This might need adjustment if title is already translated
  return (
    <Link to={`/categories/${categoryKey.replace(/\s+/g, '-').toLowerCase()}`} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-md aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <h3 className="text-white font-bold text-xl p-4 w-full">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
