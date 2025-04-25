import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'vi';

type Translations = {
  [key: string]: {
    en: string;
    vi: string;
  };
};

// Define our translations
export const translations: Translations = {
  // Language identification
  language: { en: 'en', vi: 'vi' },

  // Header
  home: { en: 'Home', vi: 'Trang chủ' },
  books: { en: 'Books', vi: 'Sách' },
  categories: { en: 'Categories', vi: 'Thể loại' },
  about: { en: 'About', vi: 'Giới thiệu' },
  searchBooks: { en: 'Search books...', vi: 'Tìm kiếm sách...' },

  // Homepage
  discoverBooks: { en: 'Discover Your Next Favorite Book', vi: 'Khám phá cuốn sách yêu thích tiếp theo của bạn' },
  findBooks: {
    en: 'Find the perfect books for every interest and enjoy special offers on our huge selection.',
    vi: 'Tìm những cuốn sách hoàn hảo cho mọi sở thích và tận hưởng các ưu đãi đặc biệt trên bộ sưu tập phong phú của chúng tôi.'
  },
  browseCollection: { en: 'Browse Collection', vi: 'Duyệt bộ sưu tập' },
  featuredBooks: { en: 'Featured Books', vi: 'Sách nổi bật' },
  viewAllBooks: { en: 'View all books', vi: 'Xem tất cả sách' },
  browseByCategory: { en: 'Browse by Category', vi: 'Duyệt theo thể loại' },
  stayUpdated: { en: 'Stay Updated', vi: 'Cập nhật thông tin' },
  newsletterText: {
    en: 'Subscribe to our newsletter for exclusive offers and the latest book recommendations',
    vi: 'Đăng ký nhận bản tin của chúng tôi để nhận các ưu đãi độc quyền và các đề xuất sách mới nhất'
  },
  emailAddress: { en: 'Your email address', vi: 'Địa chỉ email của bạn' },
  subscribe: { en: 'Subscribe', vi: 'Đăng ký' },

  // Book listings
  allBooks: { en: 'All Books', vi: 'Tất cả sách' },
  booksText: { en: 'Books', vi: 'Sách' },
  discoverCollection: { en: 'Discover our collection of amazing books', vi: 'Khám phá bộ sưu tập sách tuyệt vời của chúng tôi' },
  filterByCategory: { en: 'Filter by Category', vi: 'Lọc theo thể loại' },
  sortBy: { en: 'Sort by', vi: 'Sắp xếp theo' },
  featured: { en: 'Featured', vi: 'Nổi bật' },
  priceLowToHigh: { en: 'Price: Low to High', vi: 'Giá: Thấp đến cao' },
  priceHighToLow: { en: 'Price: High to Low', vi: 'Giá: Cao đến thấp' },
  rating: { en: 'Rating', vi: 'Đánh giá' },
  newestArrivals: { en: 'Newest Arrivals', vi: 'Mới nhất' },
  noBooksFound: { en: 'No books found.', vi: 'Không tìm thấy sách nào.' },

  // Book details
  by: { en: 'by', vi: 'bởi' },
  backToBooks: { en: 'Back to Books', vi: 'Quay lại danh sách sách' },
  inStock: { en: 'In Stock', vi: 'Còn hàng' },
  outOfStock: { en: 'Out of Stock', vi: 'Hết hàng' },
  description: { en: 'Description:', vi: 'Mô tả:' },
  category: { en: 'Category:', vi: 'Thể loại:' },
  published: { en: 'Published:', vi: 'Xuất bản:' },
  addToCart: { en: 'Add to Cart', vi: 'Thêm vào giỏ hàng' },

  // Categories
  fiction: { en: 'Fiction', vi: 'Tiểu thuyết' },
  nonFiction: { en: 'Non-Fiction', vi: 'Phi hư cấu' },
  sciFi: { en: 'Sci-Fi', vi: 'Khoa học viễn tưởng' },
  mystery: { en: 'Mystery', vi: 'Trinh thám' },
  biography: { en: 'Biography', vi: 'Tiểu sử' },
  romance: { en: 'Romance', vi: 'Lãng mạn' },
  history: { en: 'History', vi: 'Lịch sử' },
  selfHelp: { en: 'Self-Help', vi: 'Tự lực' },
  all: { en: 'All', vi: 'Tất cả' },

  // Cart
  shoppingCart: { en: 'Your Shopping Cart', vi: 'Giỏ hàng của bạn' },
  emptyCart: { en: 'Your cart is empty', vi: 'Giỏ hàng của bạn trống' },
  browseBooks: { en: 'Browse Books', vi: 'Duyệt sách' },
  product: { en: 'Product', vi: 'Sản phẩm' },
  price: { en: 'Price', vi: 'Giá' },
  quantity: { en: 'Quantity', vi: 'Số lượng' },
  subtotal: { en: 'Subtotal', vi: 'Tổng phụ' },
  continueShopping: { en: 'Continue Shopping', vi: 'Tiếp tục mua sắm' },
  clearCart: { en: 'Clear Cart', vi: 'Xóa giỏ hàng' },
  orderSummary: { en: 'Order Summary', vi: 'Tóm tắt đơn hàng' },
  shipping: { en: 'Shipping:', vi: 'Phí vận chuyển:' },
  free: { en: 'Free', vi: 'Miễn phí' },
  total: { en: 'Total:', vi: 'Tổng cộng:' },
  proceedToCheckout: { en: 'Proceed to Checkout', vi: 'Tiến hành thanh toán' },

  // Footer
  quickLinks: { en: 'Quick Links', vi: 'Liên kết nhanh' },
  customerService: { en: 'Customer Service', vi: 'Dịch vụ khách hàng' },
  contactUs: { en: 'Contact Us', vi: 'Liên hệ' },
  shippingPolicy: { en: 'Shipping Policy', vi: 'Chính sách vận chuyển' },
  returnsRefunds: { en: 'Returns & Refunds', vi: 'Đổi trả & hoàn tiền' },
  faq: { en: 'FAQ', vi: 'Câu hỏi thường gặp' },
  stayConnected: { en: 'Stay Connected', vi: 'Kết nối' },
  newsletterFooterText: {
    en: 'Subscribe to our newsletter for updates and offers',
    vi: 'Đăng ký nhận bản tin của chúng tôi để cập nhật và ưu đãi'
  },
  yourEmail: { en: 'Your email', vi: 'Email của bạn' },
  allRightsReserved: { en: 'All rights reserved.', vi: 'Tất cả quyền được bảo lưu.' },

  // Categories Page
  exploreCategories: { en: 'Explore Categories', vi: 'Khám phá thể loại' },
  findYourCategory: {
    en: 'Find your next great read by browsing our book categories',
    vi: 'Tìm cuốn sách tuyệt vời tiếp theo bằng cách duyệt các thể loại sách của chúng tôi'
  },
  booksInCategory: { en: 'books in this category', vi: 'sách trong thể loại này' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
