# Khám phá Đà Nẵng — Vẻ đẹp vàng cổ kính

Website HTML/CSS/JavaScript với API serverless trên Vercel và dữ liệu điểm đến lưu trong Neon PostgreSQL.

## Triển khai
1. Import repository này vào Vercel.
2. Chọn framework Other/None và root directory là repository root.
3. Đặt DATABASE_URL bằng connection string Neon trong Project Settings → Environment Variables; chọn kiểu secret và chỉ dùng phía server.
4. Redeploy sau khi cập nhật biến môi trường.

## API
- GET /api/places — danh sách địa điểm đã xuất bản.
- GET /api/places?q=biển — tìm kiếm.
- GET /api/health — kiểm tra kết nối database.

Không commit .env, connection strings, API keys hoặc thông tin đăng nhập.