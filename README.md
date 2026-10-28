# Nga Pijama Mẹ & Bé - Website Bán Đồ Trẻ Em Full-Stack

Hệ thống website bán pijama và đồ bộ trẻ em cao cấp phong cách Hàn Quốc cho shop **"Nga Pijama Mẹ & Bé"** (SĐT/Zalo: `0911400879`).

---

## 🌸 1. Công Nghệ & Kiến Trúc

- **Frontend**: React 18, Vite, React Router 7, Tailwind CSS (Design tokens pastel Hàn Quốc)
- **Backend**: Node.js, Express (REST API), Multer + Sharp (nén WebP và tạo thumbnail tự động)
- **Database**: SQLite (Node.js native `DatabaseSync` / SQLite3), lưu trữ gọn gàng trong 1 file duy nhất `server/data/shop.db`
- **Bảo mật**: Admin bảo vệ bằng mã PIN (`ADMIN_PIN`), lưu phiên qua Cookie `httpOnly`, chống brute-force và rate limit đơn hàng.

---

## 📦 2. Yêu Cầu Cài Đặt

- **Node.js**: Phiên bản 18+ (khuyên dùng Node 20+ hoặc 24 LTS)
- **npm**: Phiên bản 9+

---

## 🚀 3. Cài Đặt & Chạy Ứng Dụng

### Bước 1: Cài đặt dependencies
Cài đặt đồng thời cho cả client và server:
```bash
# Cài đặt client
cd client
npm install

# Cài đặt server
cd ../server
npm install
cd ..
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env` tại thư mục gốc và thư mục `server/.env`:
```env
PORT=5000
ADMIN_PIN=202688
ZALO_PHONE=0911400879
SHOP_NAME="Nga Pijama Mẹ & Bé"
SHOP_HOTLINE="0911400879"
SHOP_ADDRESS="128 Nguyễn Trãi, Thanh Xuân, Hà Nội"
BANK_NAME="Vietcombank"
BANK_ACCOUNT="0911400879"
BANK_HOLDER="NGUYEN THI NGA"
NODE_ENV=development
```

### Bước 3: Nạp dữ liệu mẫu (Seed 12 sản phẩm & đơn mẫu)
```bash
npm run seed
```
> Lệnh này sẽ tự động khởi tạo bảng cơ sở dữ liệu SQLite tại `server/data/shop.db` và nạp sẵn 12 sản phẩm pijama, các biến thể size + màu, ảnh pastel SVG và các đơn mẫu ở nhiều trạng thái để dashboard có dữ liệu trực quan ngay lập tức.

### Bước 4: Khởi động môi trường phát triển (Dev)
Chạy đồng thời cả Frontend (Vite port 3000) và Backend (Express port 5000):
```bash
npm run dev
```
- Khách hàng truy cập: [http://localhost:3000](http://localhost:3000)
- Quản trị viên truy cập: [http://localhost:3000/admin](http://localhost:3000/admin) (Mã PIN mặc định: `202688`)

---

## 🏗️ 4. Build & Triển Khai Trên 1 Máy Chủ Duy Nhất (Single Server)

Hệ thống hỗ trợ cơ chế Single Server: Express backend sẽ tự động phục vụ bản build tĩnh của React Frontend và toàn bộ API trên cùng 1 cổng (Port 5000).

```bash
# 1. Build frontend React thành file tĩnh
npm run build

# 2. Khởi chạy máy chủ sản xuất
npm start
```
Truy cập [http://localhost:5000](http://localhost:5000) – toàn bộ giao diện khách hàng và trang quản trị `/admin` sẽ hoạt động mượt mà không cần mở Vite dev server.

---

## 💾 5. Hướng Dẫn Sao Lưu & Khôi Phục File `shop.db`

Toàn bộ dữ liệu của shop (sản phẩm, hình ảnh, đơn hàng, khách hàng) được lưu trữ độc lập trong 1 file duy nhất:
```
server/data/shop.db
```

### Cách sao lưu (Backup):
1. **Thủ công**: Sao chép file `server/data/shop.db` ra thư mục an toàn hoặc Google Drive / USB:
   ```bash
   cp server/data/shop.db server/data/backup_shop_$(date +%Y%m%d).db
   ```
2. **Khôi phục**: Đổi tên file sao lưu thành `shop.db` và đặt lại vào thư mục `server/data/`.

---

## 🛡️ 6. Quy Tắc Nghiệp Vụ Quan Trọng

1. **Khấu trừ & Hoàn tồn kho (Inventory Lifecycle)**:
   - Tồn kho của từng biến thể chỉ được trừ khi đơn hàng chuyển sang trạng thái `"Đã xác nhận"`.
   - Nếu đơn hàng bị hủy từ trạng thái đã xác nhận trở đi, số lượng tồn sẽ được tự động hoàn lại kho.
   - Thao tác thực hiện trong một **SQLite Transaction** an toàn tuyệt đối. Mỗi đơn chỉ trừ/hoàn đúng 1 lần qua cờ `stock_deducted`.
2. **Tính toán giá phía máy chủ (Server-side price verification)**:
   - Khi khách gửi đơn đặt hàng, server tự động tra cứu lại giá gốc từ bảng `products`. Tuyệt đối không tin tưởng giá gửi lên từ trình duyệt.
3. **Kiểm tra tồn kho**:
   - Chặn đặt quá số lượng tồn tại cả client và server; thông báo rõ tên món và số lượng còn lại.
4. **Bảo vệ chống spam**:
   - API đặt hàng có rate-limit tối đa 20 lượt / 15 phút.
   - Mọi câu lệnh SQL đều sử dụng parameterized queries chống SQL Injection.
