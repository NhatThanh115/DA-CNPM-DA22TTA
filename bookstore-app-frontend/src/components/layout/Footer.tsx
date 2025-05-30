import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BookHaven</h3>
            <p className="text-gray-300">
              Your one-stop destination for all your reading needs. Find the best books at the best prices.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">{t('home')}</Link></li>
              <li><Link to="/books" className="text-gray-300 hover:text-white">{t('books')}</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white">{t('categories')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">{t('about')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('customerService')}</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white">{t('contactUs')}</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">{t('shippingPolicy')}</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white">{t('returnsRefunds')}</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">{t('faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('stayConnected')}</h4>
            <p className="text-gray-300 mb-3">{t('newsletterFooterText')}</p>
            <form className="flex">
              <input
                type="email"
                placeholder={t('yourEmail')}
                className="px-4 py-2 w-full text-gray-800 rounded-l focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700 transition-colors"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} BookHaven. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
