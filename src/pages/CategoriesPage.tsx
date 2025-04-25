import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { books } from '../data/books';
import { Category } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export default function CategoriesPage() {
  const { t } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = `${t('categories')} | BookHaven`;
  }, [t]);

  // Generate category counts
  const categoryMap = new Map<string, number>();
  for (const book of books) {
    const count = categoryMap.get(book.category) || 0;
    categoryMap.set(book.category, count + 1);
  }

  const categories: Array<{name: string; key: string; count: number; image: string}> = [
    {
      name: t('fiction'),
      key: 'fiction',
      count: categoryMap.get('fiction') || 0,
      image: "https://images.unsplash.com/photo-1495640388908-05fa85288e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('nonFiction'),
      key: 'non-fiction',
      count: categoryMap.get('non-fiction') || 0,
      image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('sciFi'),
      key: 'sci-fi',
      count: categoryMap.get('sci-fi') || 0,
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('mystery'),
      key: 'mystery',
      count: categoryMap.get('mystery') || 0,
      image: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('biography'),
      key: 'biography',
      count: categoryMap.get('biography') || 0,
      image: "https://images.unsplash.com/photo-1529473814998-077b4fec6770?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('romance'),
      key: 'romance',
      count: categoryMap.get('romance') || 0,
      image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('history'),
      key: 'history',
      count: categoryMap.get('history') || 0,
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    },
    {
      name: t('selfHelp'),
      key: 'self-help',
      count: categoryMap.get('self-help') || 0,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{t('exploreCategories')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('findYourCategory')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link
            to={`/categories/${category.key}`}
            key={category.key}
            className="group"
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-bold text-xl p-4 w-full">{category.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{category.count} {t('booksInCategory')}</span>
                  <span className="text-blue-600 group-hover:underline">{t('viewAllBooks')} →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
