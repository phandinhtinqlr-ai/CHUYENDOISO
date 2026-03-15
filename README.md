# Dự án Chuyển đổi số Ba Na Hills

Hệ thống quản lý tiến độ các nhiệm vụ thuộc chương trình chuyển đổi số Ba Na Hills.

## Cách chạy local

1. Clone repository
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Copy file `.env.example` thành `.env` và điền thông tin Supabase:
   ```bash
   cp .env.example .env
   ```
4. Chạy development server:
   ```bash
   npm run dev
   ```

## Cách set env

Tạo file `.env` ở thư mục gốc của project và thêm các biến sau:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Cách deploy GitHub

1. Tạo repository mới trên GitHub
2. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your_github_repo_url>
   git push -u origin main
   ```

## Cách deploy Vercel

1. Đăng nhập vào [Vercel](https://vercel.com)
2. Chọn "Add New..." -> "Project"
3. Import repository từ GitHub
4. Trong phần "Environment Variables", thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy"

Vercel sẽ tự động nhận diện project Vite và sử dụng file `vercel.json` để cấu hình rewrite rules cho React Router.
