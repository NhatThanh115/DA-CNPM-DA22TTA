import { Link } from 'react-router-dom';
import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEffect } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { t } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = `${t('shoppingCart')} | BookHaven`;
  }, [t]);

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    updateQuantity(bookId, newQuantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('shoppingCart')}</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-6">{t('emptyCart')}</p>
          <Link
            to="/books"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            {t('browseBooks')}
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left p-4">{t('product')}</th>
                  <th className="text-left p-4 hidden sm:table-cell">{t('price')}</th>
                  <th className="text-left p-4">{t('quantity')}</th>
                  <th className="text-right p-4">{t('subtotal')}</th>
                  <th className="p-4 w-10" />
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.book.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/books/${item.book.id}`}
                          className="shrink-0 w-16 h-24 overflow-hidden"
                        >
                          <img
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/books/${item.book.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {item.book.title}
                          </Link>
                          <p className="text-sm text-gray-600">{item.book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">${item.book.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <select
                          value={item.quantity}
                          onChange={e => handleQuantityChange(item.book.id, Number.parseInt(e.target.value))}
                          className="border rounded p-1 w-16"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => removeFromCart(item.book.id)}
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="w-full md:w-auto flex space-x-4">
              <Link
                to="/books"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                {t('continueShopping')}
              </Link>
              <button onClick={clearCart} className="text-red-600 hover:text-red-800">
                {t('clearCart')}
              </button>
            </div>

            <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">{t('orderSummary')}</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>{t('subtotal')}:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('shipping')}:</span>
                  <span>{t('free')}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>{t('total')}:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors">
                {t('proceedToCheckout')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
