# 📚 Web Bán Sách

Một website bán sách hiện đại, tải siêu nhanh được xây dựng bằng **React**, **TypeScript** và **Vite**.

## 🚀 Tính năng

- 🔎 Duyệt và tìm kiếm sách
- 🛒 Thêm sách vào giỏ hàng và thanh toán
- 🔐 Xác thực người dùng (Đăng nhập/Đăng ký)
- 📦 Quản lý đơn hàng
- 🖥️ Giao diện responsive (tương thích di động)
- ⚡ Tốc độ tải cực nhanh nhờ Vite

## 🛠️ Công nghệ sử dụng

- **Frontend**: React, TypeScript, Vite
- **Backend**: NodeJS
- **Giao diện**: Tailwind CSS

## 📦 Cài đặt
- Cài đặt [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) và cập nhật cấu hình:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // thiết lập phiên bản React
  settings: { react: { version: '18.3' } },
  plugins: {
    // Thêm plugin React
    react,
  },
  rules: {
    // các quy tắc khác...
    // Bật các quy tắc được khuyến nghị
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
- Chạy các lệnh sau:
```bash
# Clone repository
git clone https://github.com/your-username/bookstore-web.git

# Di chuyển vào thư mục dự án
cd bookstore-web

# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy server phát triển
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

## 🧹 Các lệnh tiện ích

Lệnh | Chức năng

npm run dev | Khởi chạy server phát triển

npm run build | Build dự án cho production

npm run preview | Xem trước bản build

npm run lint | Kiểm tra lỗi code (lint)

Hiện tại, có hai plugin chính thức đang được hỗ trợ:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) sử dụng [Babel](https://babeljs.io/) hỗ trợ Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) sử dụng [SWC](https://swc.rs/) hỗ trợ Fast Refresh

