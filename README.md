# Mencari Rute dengan Mapbox

Ini adalah proyek untuk mengembangkan aplikasi React dengan Vite dan mengintegrasikannya dengan Mapbox. Aplikasi ini akan menggunakan data dari repository mapboxBackend sebagai sumber informasi untuk ditampilkan pada peta Mapbox.

## Prasyarat

Sebelum memulai, pastikan telah menginstal beberapa prasyarat berikut:

* Node.js: [https://nodejs.org](https://nodejs.org/) (versi 12 atau yang lebih baru)
* NPM: Paket Manajemen Node.js, yang akan diinstal bersamaan dengan Node.js.
* memiliki access token dari mapbox
* mapboxBackend sudah berjalan

## Instalasi

1. Clone repositori ini ke direktori lokal:

   ```bash
   git clone https://github.com/realiyams/mapboxFrontend.git
   ```
2. Masuk direktori proyek:

   ```bash
   cd mapboxFrontend
   ```
3. Install dependensi proyek:

   ```bash
   npm install
   ```

## Konfigurasi

1. Salin file `.env.example` dan ubah namanya menjadi `.env`.
2. Di dalam file `.env`, pastikan untuk mengatur nilai-nilai yang sesuai untuk token dan pengaturan lainnya yang diperlukan untuk mengakses backend dan Mapbox.

```.env
VITE_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
VITE_BACKEND=mapboxBackend
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi, jalankan perintah berikut di terminal:

```bash
npm run dev
```

Aplikasi akan dijalankan pada mode pengembangan dan akan dapat diakses melalui browser di `http://localhost:5173`.

## Integrasi dengan Backend

Aplikasi ini menggunakan backend sebagai sumber data dari repository mapboxBackend. Pastikan backend telah berjalan dan dapat diakses pada URL yang telah ditentukan dalam file `.env`. Pastikan juga endpoint backend yang diperlukan untuk mengambil data telah diimplementasikan dengan benar.

Untuk mengintegrasikan backend dengan aplikasi React, kamu perlu memodifikasi file `src/App.js` atau komponen lain yang sesuai. Pada komponen tersebut, kamu dapat menggunakan metode `fetch` atau paket lain seperti `axios` untuk mengambil data dari endpoint backend yang sesuai.

Setelah mendapatkan data dari backend, kamu dapat menggunakan data tersebut untuk menggambar objek atau elemen pada peta Mapbox menggunakan komponen Mapbox yang disediakan.

## Sample Gambar

| ![1685109809034](https://file+.vscode-resource.vscode-cdn.net/e%3A/Projects/SkripsiHabil/frontend/image/README/1685109809034.png) | ![1685109782183](https://file+.vscode-resource.vscode-cdn.net/e%3A/Projects/SkripsiHabil/frontend/image/README/1685109782183.png) |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ![1685109762485](https://raw.githubusercontent.com/realiyams/mapboxFrontend/main/image/README/1685109762485.png) | ![1685109839093](https://file+.vscode-resource.vscode-cdn.net/e%3A/Projects/SkripsiHabil/frontend/image/README/1685109839093.png) |
