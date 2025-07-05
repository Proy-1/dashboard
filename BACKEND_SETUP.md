# Setup Backend Integration

## 📋 **Langkah-langkah Setup Backend:**

### 1. **Clone dan Setup Backend**
```bash
# Clone repository backend
git clone https://github.com/Proy-1/back.git
cd back/backend

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env file dan set MONGO_URI sesuai dengan MongoDB Anda
```

### 2. **Konfigurasi MongoDB**
```bash
# Jika menggunakan MongoDB lokal:
MONGO_URI=mongodb://localhost:27017/pitipaw

# Jika menggunakan MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pitipaw?retryWrites=true&w=majority
```

### 3. **Jalankan Backend**
```bash
# Di folder backend/
python app.py

# Backend akan berjalan di http://localhost:5000
```

### 4. **Test Koneksi Backend**
Buka browser dan akses: `http://localhost:5000/api/health`
Harus menampilkan: `{"status": "ok", "message": "Backend is running"}`

### 5. **Jalankan Frontend Dashboard**
```bash
# Di folder dashboard/
.\start.ps1
# Pilih opsi 1 (Python) atau 2 (Node.js)
```

## 🔧 **Konfigurasi Frontend:**

### File: `assets/js/config.js`
- **Development**: Otomatis menggunakan `http://localhost:5000`
- **Production**: Edit `getBackendURL()` sesuai domain backend Anda

### Struktur API Endpoints:
```
Backend API:
├── GET    /api/health                 # Health check
├── GET    /api/products               # Ambil semua produk
├── POST   /api/products               # Tambah produk baru
├── GET    /api/products/:id           # Ambil satu produk
├── PUT    /api/products/:id           # Update produk
├── DELETE /api/products/:id           # Hapus produk
└── POST   /api/upload                 # Upload gambar
```

## ✅ **Fitur yang Sudah Terintegrasi:**

### 1. **Manajemen Produk**
- ✅ Tampil daftar produk dari database
- ✅ Tambah produk baru
- ✅ Edit produk existing
- ✅ Hapus produk
- ✅ Upload gambar produk

### 2. **Real-time Updates**
- ✅ Auto-refresh data setelah CRUD operations
- ✅ Loading states dan feedback notifications
- ✅ Error handling dan retry mechanism

### 3. **Connection Status**
- ✅ Backend connection indicator
- ✅ Offline mode fallback
- ✅ Automatic reconnection attempts

## 🚀 **Testing Integration:**

### 1. **Test Health Check**
```javascript
// Di console browser:
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. **Test API dari Dashboard**
1. Buka dashboard di browser
2. Pergi ke halaman "Manajemen Produk"
3. Coba tambah produk baru
4. Lihat notifikasi success/error

### 3. **Test Upload Gambar**
1. Saat menambah produk, pilih file gambar
2. Klik tombol "Upload"
3. Pastikan URL gambar muncul di form

## 🐛 **Troubleshooting:**

### Problem: "Backend Offline"
**Solution:**
```bash
# 1. Pastikan backend berjalan
python app.py

# 2. Cek port yang digunakan
netstat -an | grep 5000

# 3. Test manual
curl http://localhost:5000/api/health
```

### Problem: CORS Error
**Solution:**
Backend sudah menggunakan `flask-cors`, pastikan:
```python
# Di app.py:
from flask_cors import CORS
CORS(app)
```

### Problem: MongoDB Connection Error
**Solution:**
```bash
# 1. Cek MongoDB service running
sudo systemctl status mongod

# 2. Test connection
mongo mongodb://localhost:27017/pitipaw

# 3. Periksa .env file
cat .env
```

## 📊 **Data Structure:**

### Product Schema (MongoDB):
```json
{
  "_id": "ObjectId",
  "name": "String",
  "price": "Number",
  "description": "String",
  "image_url": "String"
}
```

### API Response Format:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "iPhone 14 Pro",
  "price": 15000000,
  "description": "Smartphone flagship dengan chip A16",
  "image_url": "/static/uploads/iphone14.jpg"
}
```

## 🔄 **Next Steps:**

1. **Authentication**: Implementasi login/logout dengan backend
2. **Orders Management**: CRUD operations untuk pesanan
3. **Customer Management**: CRUD operations untuk pelanggan
4. **Analytics**: Dashboard analytics dari data real
5. **Real-time Features**: WebSocket untuk updates real-time

## 📞 **Support:**

Jika ada masalah dengan integrasi:
1. Periksa console browser untuk error messages
2. Periksa terminal backend untuk logs
3. Test manual dengan curl/Postman
4. Periksa file konfigurasi (config.js, .env)
