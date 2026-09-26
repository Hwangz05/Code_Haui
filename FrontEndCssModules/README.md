# 🚀 CODE HAUI - Phiên bản CSS Modules (React 18 + Vite)

Dự án Frontend được xây dựng hoàn toàn bằng **CSS chuẩn truyền thống kết hợp CSS Modules** (`*.module.css`), không sử dụng Tailwind CSS. 

---

## 💡 Ưu Điểm Của CSS Modules Trong Dự Án Này

1. **Cú pháp CSS chuẩn quen thuộc**: Dùng các thuộc tính chuẩn `display: flex`, `color: #fff`, `background-color`, `padding: 1rem`... dễ học, dễ đọc, không cần nhớ class viết tắt.
2. **Không lo trùng lặp class (Scoped CSS)**: Mỗi component có một file `[Name].module.css` riêng biệt. Class `.title` ở trang Login sẽ không bao giờ bị ảnh hưởng bởi `.title` ở trang Home.
3. **Quản lý biến màu sắc tập trung**: Toàn bộ mã màu HaUI (`#f97316`, `#d32f2f`, `#fbc02d`) được định nghĩa trong `src/styles/variables.css`.
4. **Kiến trúc phân tầng Clean Architecture**: Giữ nguyên tính năng, tầng Service, Context, Custom Hooks sẵn sàng kết nối Backend Spring Boot.

---

## 📁 Cấu Trúc Thư Mục

```
code-haui-css-modules/
├── public/
│   └── haui-bg.png                   # Ảnh tòa nhà HaUI thực tế
│
├── src/
│   ├── components/
│   │   ├── common/                   # UI dùng chung (kèm file .module.css tương ứng)
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Card.module.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Input.module.css
│   │   │   └── Badge/
│   │   │       ├── Badge.jsx
│   │   │       └── Badge.module.css
│   │   │
│   │   ├── layout/                   # Bố cục Header, Footer, Layout
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.module.css
│   │   │   └── Footer/
│   │   │       ├── Footer.jsx
│   │   │       └── Footer.module.css
│   │   │
│   │   └── features/                 # Tính năng nghiệp vụ
│   │       ├── Auth/                 # Form đăng nhập MSSV (One HaUI)
│   │       └── Courses/              # Thẻ khóa học
│   │
│   ├── pages/                        # Các trang màn hình
│   │   ├── Home/
│   │   │   ├── HomePage.jsx
│   │   │   └── HomePage.module.css
│   │   ├── Login/
│   │   │   ├── LoginPage.jsx
│   │   │   └── LoginPage.module.css
│   │   ├── ThiDau/                   # Trang thi đấu (đổi từ thử thách)
│   │   │   ├── ThiDauPage.jsx
│   │   │   └── ThiDauPage.module.css
│   │   ├── ThiDauDetail/             # Màn hình làm bài & nộp code
│   │   │   ├── ThiDauDetailPage.jsx
│   │   │   └── ThiDauDetailPage.module.css
│   │   ├── KhoaHoc/
│   │   ├── Leaderboard/
│   │   └── Profile/
│   │
│   ├── styles/
│   │   ├── variables.css             # Định nghĩa mã màu HaUI, font chữ, radius
│   │   └── global.css                # CSS toàn cục & reset
│   │
│   ├── context/                      # Quản lý AuthContext
│   ├── hooks/                        # useAuth, useLocalStorage, useDebounce
│   ├── services/                     # Gọi API Spring Boot
│   ├── config/                       # Routes & API Config
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

## 🛠️ Hướng Dẫn Mở & Chạy Dự Án Trong VS Code

1. Giải nén file `FrontEnd_CSS_Modules.zip`.
2. Mở **VS Code** -> Chọn `File` -> `Open Folder...` -> Chọn thư mục vừa giải nén.
3. Mở Terminal trong VS Code (`Ctrl + ~`) và chạy:

```bash
# 1. Cài đặt các thư viện (chỉ mất vài giây vì không phụ thuộc Tailwind)
npm install

# 2. Khởi chạy ứng dụng
npm run dev
```

4. Trình duyệt sẽ mở tại địa chỉ: `http://localhost:3000` (hoặc `http://localhost:5173`).
