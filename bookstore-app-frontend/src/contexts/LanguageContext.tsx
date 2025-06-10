import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'vi';

type Translations = {
  [key: string]: {
    en: string;
    vi: string;
  };
};

export const translations: Translations = {
  language: { en: 'en', vi: 'vi' },
  home: { en: 'Home', vi: 'Trang chủ' },
  books: { en: 'Books', vi: 'Sách' },
  categories: { en: 'Categories', vi: 'Thể loại' },
  about: { en: 'About', vi: 'Giới thiệu' },
  searchBooks: { en: 'Search books...', vi: 'Tìm kiếm sách...' },
  login: { en: 'Login', vi: 'Đăng nhập' },
  register: { en: 'Register', vi: 'Đăng ký' },
  logout: { en: 'Logout', vi: 'Đăng xuất' },
  email: { en: 'Email', vi: 'Email' },
  password: { en: 'Password', vi: 'Mật khẩu' },
  confirmPassword: { en: 'Confirm Password', vi: 'Xác nhận mật khẩu' },
  fullName: { en: 'Full Name', vi: 'Họ và tên' },
  username: { en: 'Username', vi: 'Tên người dùng' },
  createAccount: { en: 'Create Account', vi: 'Tạo tài khoản' },
  loggingIn: { en: 'Logging in...', vi: 'Đang đăng nhập...' },
  registering: { en: 'Registering...', vi: 'Đang đăng ký...' },
  enterEmail: { en: 'Enter your email', vi: 'Nhập email của bạn' },
  enterPassword: { en: 'Enter your password', vi: 'Nhập mật khẩu của bạn' },
  enterName: { en: 'Enter your full name', vi: 'Nhập họ và tên của bạn' },
  enterUsername: { en: 'Choose a username', vi: 'Chọn tên người dùng' },
  reenterPassword: { en: 'Re-enter your password', vi: 'Nhập lại mật khẩu' },
  passwordsDontMatch: { en: 'Passwords do not match', vi: 'Mật khẩu không khớp' },
  passwordTooShort: { en: 'Password must be at least 6 characters long', vi: 'Mật khẩu phải có ít nhất 6 ký tự' },
  dontHaveAccount: { en: 'Don\'t have an account?', vi: 'Chưa có tài khoản?' },
  alreadyHaveAccount: { en: 'Already have an account?', vi: 'Đã có tài khoản?' },
  registerNow: { en: 'Register now', vi: 'Đăng ký ngay' },
  loginHere: { en: 'Login here', vi: 'Đăng nhập tại đây' },
  demoCredentials: { en: 'Demo Credentials:', vi: 'Thông tin đăng nhập demo:' },
  show: { en: 'Show', vi: 'Hiện' },
  hide: { en: 'Hide', vi: 'Ẩn' },
  myProfile: { en: 'My Profile', vi: 'Hồ sơ của tôi' },
  myFavorites: { en: 'My Favorites', vi: 'Yêu thích của tôi' },
  account: { en: 'Account', vi: 'Tài khoản' },
  accountDetails: { en: 'Account Details', vi: 'Thông tin tài khoản' },
  edit: { en: 'Edit', vi: 'Sửa' },
  save: { en: 'Save', vi: 'Lưu' },
  saving: { en: 'Saving...', vi: 'Đang lưu...' },
  cancel: { en: 'Cancel', vi: 'Hủy' },
  noFavorites: { en: 'You haven\'t added any books to your favorites yet.', vi: 'Bạn chưa thêm sách nào vào danh sách yêu thích.' },
  browseCatalog: { en: 'Browse Catalog', vi: 'Duyệt danh mục' },
  addToFavorites: { en: 'Add to Favorites', vi: 'Thêm vào yêu thích' },
  removeFromFavorites: { en: 'Remove from Favorites', vi: 'Xóa khỏi yêu thích' },
  discoverBooks: { en: 'Discover Your Next Favorite Book', vi: 'Khám phá cuốn sách yêu thích tiếp theo của bạn' },
  findBooks: { en: 'Find the perfect books for every interest and enjoy special offers on our huge selection.', vi: 'Tìm những cuốn sách hoàn hảo cho mọi sở thích và tận hưởng các ưu đãi đặc biệt trên bộ sưu tập phong phú của chúng tôi.' },
  browseCollection: { en: 'Browse Collection', vi: 'Duyệt bộ sưu tập' },
  featuredBooks: { en: 'Featured Books', vi: 'Sách nổi bật' },
  viewAllBooks: { en: 'View all books', vi: 'Xem tất cả sách' },
  browseByCategory: { en: 'Browse by Category', vi: 'Duyệt theo thể loại' },
  stayUpdated: { en: 'Stay Updated', vi: 'Cập nhật thông tin' },
  newsletterText: { en: 'Subscribe to our newsletter for exclusive offers and the latest book recommendations', vi: 'Đăng ký nhận bản tin của chúng tôi để nhận các ưu đãi độc quyền và các đề xuất sách mới nhất' },
  emailAddress: { en: 'Your email address', vi: 'Địa chỉ email của bạn' },
  subscribe: { en: 'Subscribe', vi: 'Đăng ký' },
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
  by: { en: 'by', vi: 'bởi' },
  backToBooks: { en: 'Back to Books', vi: 'Quay lại danh sách sách' },
  inStock: { en: 'In Stock', vi: 'Còn hàng' },
  outOfStock: { en: 'Out of Stock', vi: 'Hết hàng' },
  description: { en: 'Description:', vi: 'Mô tả:' },
  category: { en: 'Category:', vi: 'Thể loại:' },
  published: { en: 'Published:', vi: 'Xuất bản:' },
  addToCart: { en: 'Add to Cart', vi: 'Thêm vào giỏ hàng' },
  fiction: { en: 'Fiction', vi: 'Tiểu thuyết' },
  nonFiction: { en: 'Non-Fiction', vi: 'Phi hư cấu' },
  sciFi: { en: 'Sci-Fi', vi: 'Khoa học viễn tưởng' },
  mystery: { en: 'Mystery', vi: 'Trinh thám' },
  biography: { en: 'Biography', vi: 'Tiểu sử' },
  romance: { en: 'Romance', vi: 'Lãng mạn' },
  history: { en: 'History', vi: 'Lịch sử' },
  selfHelp: { en: 'Self-Help', vi: 'Tự lực' },
  all: { en: 'All', vi: 'Tất cả' },
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
  quickLinks: { en: 'Quick Links', vi: 'Liên kết nhanh' },
  customerService: { en: 'Customer Service', vi: 'Dịch vụ khách hàng' },
  contactUs: { en: 'Contact Us', vi: 'Liên hệ' },
  shippingPolicy: { en: 'Shipping Policy', vi: 'Chính sách vận chuyển' },
  returnsRefunds: { en: 'Returns & Refunds', vi: 'Đổi trả & hoàn tiền' },
  faq: { en: 'FAQ', vi: 'Câu hỏi thường gặp' },
  stayConnected: { en: 'Stay Connected', vi: 'Kết nối' },
  newsletterFooterText: { en: 'Subscribe to our newsletter for updates and offers', vi: 'Đăng ký nhận bản tin của chúng tôi để cập nhật và ưu đãi' },
  yourEmail: { en: 'Your email', vi: 'Email của bạn' },
  allRightsReserved: { en: 'All rights reserved.', vi: 'Tất cả quyền được bảo lưu.' },
  exploreCategories: { en: 'Explore Categories', vi: 'Khám phá thể loại' },
  findYourCategory: { en: 'Find your next great read by browsing our book categories', vi: 'Tìm cuốn sách tuyệt vời tiếp theo bằng cách duyệt các thể loại sách của chúng tôi' },
  booksInCategory: { en: 'books in this category', vi: 'sách trong thể loại này' },
  errorFetchingBooks: { en: 'Error fetching books. Please try again later.', vi: 'Lỗi khi tải sách. Vui lòng thử lại sau.' },
  loading: { en: 'Loading', vi: 'Đang tải' },
  noFeaturedBooks: { en: 'No featured books available at the moment.', vi: 'Hiện tại không có sách nổi bật nào.' },
  refresh: { en: 'Refresh', vi: 'Làm mới' },
  error: { en: 'Error', vi: 'Lỗi' },
  loggingOut: { en: 'Logging out...', vi: 'Đang đăng xuất...' },
  previousPage: { en: 'Previous', vi: 'Trang trước' },
  nextPage: { en: 'Next', vi: 'Trang sau' },
  invalidBookId: { en: 'Invalid book ID provided.', vi: 'ID sách không hợp lệ.' },
  bookNotFound: { en: 'Book not found.', vi: 'Không tìm thấy sách.' },
  errorFetchingBook: { en: 'Error fetching book details.', vi: 'Lỗi khi tải chi tiết sách.' },
  bookCouldNotBeLoaded: { en: 'The book details could not be loaded.', vi: 'Không thể tải chi tiết sách.' },
  invalidCategory: { en: 'Invalid category specified.', vi: 'Thể loại không hợp lệ.' },
  discoverCollectionByCategory: { en: 'Discover our collection of {category} books', vi: 'Khám phá bộ sưu tập sách {category} của chúng tôi' },
  noBooksInCategory: { en: 'No books found in the {category} category.', vi: 'Không tìm thấy sách nào trong thể loại {category}.' },
  errorFetchingCategories: { en: 'Error fetching categories.', vi: 'Lỗi khi tải danh sách thể loại.' },
  noCategoriesFound: { en: 'No categories found.', vi: 'Không tìm thấy thể loại nào.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key]?.[language] || translations[key]?.['en'] || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
