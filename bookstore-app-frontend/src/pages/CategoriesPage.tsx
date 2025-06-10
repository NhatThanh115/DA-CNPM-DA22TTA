// src/pages/CategoriesPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchCategories, fetchBooks } from '../services/bookService'; 

interface CategoryInfo {
  name: string;
  key: string;
  count: number;
  image: string; 
}

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categoriesInfo, setCategoriesInfo] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const categoryImages: Record<string, string> = {
    fiction: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcO7nriZ1gHfLWTEOgN4AHuzifQpjxKIcYw&s",
    'non-fiction': "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    'sci-fi': "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    mystery: "https://images.unsplash.com/photo-1587876931567-564ce588bfbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    biography: "https://images.unsplash.com/photo-1529473814998-077b4fec6770?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    romance: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
    'self-help': "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60",
  };

  useEffect(() => {
    document.title = `${t('categories')} | BookHaven`;
    const loadCategories = async () => {
      try {
        setLoading(true);
        const backendCategories = await fetchCategories();

        const categoryDataPromises = backendCategories.map(async (catKey) => {
          try {
  
            const countResponse = await fetchBooks({ category: catKey, limit: 1 });
            return {
              name: t(catKey) || catKey.charAt(0).toUpperCase() + catKey.slice(1), 
              key: catKey,
              count: countResponse.totalBooks,
              image: categoryImages[catKey.toLowerCase()] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60' // Default image
            };
          } catch (countErr) {
            console.warn(`Could not fetch count for category ${catKey}:`, countErr);
            return {
              name: t(catKey) || catKey.charAt(0).toUpperCase() + catKey.slice(1),
              key: catKey,
              count: 0, 
              image: categoryImages[catKey.toLowerCase()] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60'
            };
          }
        });

        const resolvedCategoryData = await Promise.all(categoryDataPromises);
        setCategoriesInfo(resolvedCategoryData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(t('errorFetchingCategories')); 
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, [t]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{t('exploreCategories')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('findYourCategory')}
        </p>
      </div>

      {categoriesInfo.length === 0 && !loading && (
        <div className="text-center text-gray-500">{t('noCategoriesFound')}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoriesInfo.map(category => (
          <Link
            to={`/categories/${category.key.replace(/\s+/g, '-').toLowerCase()}`}
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
