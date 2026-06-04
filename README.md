# Booking Hotel - Full Stack Application

Aplikasi booking hotel dengan React frontend dan Node.js Express backend.

## Struktur Project

```
booking-hotel/
├── frontend/       (React App)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/        (Node.js Express API)
│   ├── database/
│   │   └── backup.sql
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Setup Awal

### Prerequisites
- Node.js v14 atau lebih tinggi
- MySQL/MariaDB (dari Laragon atau local server)

### 1. Clone Repository

```bash
git clone https://github.com/WESLEYICI/booking-hotel.git
cd booking-hotel
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env sesuai konfigurasi database lokal kamu
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
```

#### Import Database

Sebelum jalankan server, import database:

```bash
# Pastikan MySQL/MariaDB sudah berjalan
# Dari terminal atau GUI tool (HeidiSQL, phpMyAdmin):

mysql -u root -p -e "CREATE DATABASE bookhotel;"
mysql -u root -p bookhotel < database/backup.sql
```

Atau pakai phpMyAdmin:
1. Buka phpMyAdmin
2. Create database `bookhotel`
3. Import file `database/backup.sql`

#### Jalankan Backend

```bash
npm start
# atau dengan nodemon
npm run dev
```

Server akan jalan di `http://localhost:5000`

---

### 3. Setup Frontend

```bash
cd ../frontend  # atau kembali ke root dan cd frontend jika menggunakan struktur terpisah

# Install dependencies
npm install

# Start development server
npm start
```

Frontend akan buka di `http://localhost:3000`

---

## API Endpoints

Backend menyediakan API di:
- Base URL: `http://localhost:5000/api`

Main endpoints:
- `/auth` - Authentication & login
- `/users` - User management
- `/bookings` - Booking management

---

## Environment Variables

### Backend (.env)

```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=bookhotel
DB_PORT=3306
NODE_ENV=development
```

Jangan commit file `.env` ke Git. Gunakan `.env.example` sebagai template.

---

## Collaboration

Jika kamu melanjutkan development bersama teman:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Buat branch baru untuk fitur baru**
   ```bash
   git checkout -b feature/nama-fitur
   ```

3. **Setelah selesai, push ke GitHub**
   ```bash
   git add .
   git commit -m "Deskripsi perubahan"
   git push origin feature/nama-fitur
   ```

4. **Buat Pull Request di GitHub** untuk review

---

## Troubleshooting

### Database connection failed
- Pastikan MySQL/MariaDB sudah berjalan
- Cek konfigurasi di `.env` (host, port, user, password)
- Pastikan database `bookhotel` sudah dibuat

### Port sudah digunakan
- Frontend: ubah PORT di terminal atau environment
  ```bash
  PORT=3001 npm start
  ```
- Backend: ubah `PORT` di `.env`

### CORS Error
- Backend sudah dikonfigurasi untuk accept request dari localhost:3000
- Jika ada error, cek `app.js` di bagian CORS configuration

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Flowbite
- **Backend**: Node.js, Express, MySQL
- **Database**: MySQL/MariaDB

---

## License

MIT (atau sesuai lisensi yang dipilih)
