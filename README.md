# BlogVerse Pro — P8 Laravel 13 + Inertia.js + React

Nama repositori: `ifs24023-pabwe2026-sk-p8-laravel-inertia`

Aplikasi studi kasus P8 (Bagian C): Platform publikasi artikel multi-tier dengan arsitektur **Clean Architecture & Feature-First** menggunakan Laravel 13, Inertia.js, React, PostgreSQL, PhpOffice/PhpSpreadsheet, dan integrasi OpenAI.

---

## Daftar Isi
- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama & Multi-Tier Architecture](#fitur-utama--multi-tier-architecture)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Folder (Feature-First)](#struktur-folder-feature-first)
- [Daftar Rute Aplikasi](#daftar-rute-aplikasi)
- [Instalasi & Menjalankan Aplikasi](#instalasi--menjalankan-aplikasi)
- [Akun Pengguna Default](#akun-pengguna-default)
- [Pengujian & Jaminan Mutu](#pengujian--jaminan-mutu)

---

## Tentang Proyek
BlogVerse Pro adalah platform penerbitan artikel modern yang dirancang untuk mendukung tiga tingkatan hak akses:
1. **Publik (Guest)**: Akses membaca artikel secara leluasa tanpa perlu masuk log, pencarian dan penyaringan kategori, perenderan Markdown dengan TOAST UI Viewer, serta navigasi informatif ke halaman Login dan Register.
2. **Anggota (Penulis)**: Pengelolaan artikel pribadi (CRUD), unggah sampul (cover), ekspor/impor Excel, perancangan artikel otomatis berbasis OpenAI API, dan pengaturan profil.
3. **Administrator**: Pengawasan seluruh pengguna dan artikel dalam sistem secara read-only serta ekspor data komprehensif ke berkas Excel.

---

## Fitur Utama & Multi-Tier Architecture

### 1. Tingkatan Umum (Publik)
- **Sticky Top Navbar**: Menyajikan brand logo interaktif serta tombol aksi **Masuk (Login)** dan **Daftar (Register)** dengan ikon responsif.
- **Hero Banner Beranda**: Sambutan beranda dengan tombol Call-to-Action (CTA) langsung menuju halaman Login dan Register.
- **Pencarian & Filter**: Pencarian real-time berdasarkan judul/konten serta filter badge kategori artikel (Teknologi, Pendidikan, Gaya Hidup, Bisnis, Opini, Umum).
- **Pembaca Artikel (Markdown)**: Merender isi artikel format Markdown dengan **TOAST UI Viewer**.
- **Kartu Komunitas**: Bagian bawah halaman membaca artikel menyediakan kartu ajakan bergabung dengan tautan cepat ke Login & Register.
- **Footer Editorial**: Baris navigasi bawah memuat tautan Beranda Publik, Halaman Login, dan Halaman Register.

### 2. Tingkatan Anggota (Penulis)
- **Ringkasan Statistik**: 3 kartu ringkasan interaktif menyajikan Total Artikel, Total Selesai (dipublikasikan), dan Belum Selesai (draf).
- **Format List View**: Tampilan daftar artikel disajikan ringkas dan responsif (bukan card) demi kemudahan pemantauan.
- **Menu Tindakan Kebab (⋮)**: Dropdown menu vertikal berisi pilihan:
  - **Detail** (ikon mata, warna teks primary)
  - **Ubah Edit** (ikon pensil, warna teks primary)
  - **Hapus** (ikon tempat sampah, warna teks merah)
  - Disertai tombol cepat toggle status (Publikasikan ↔ Jadikan Draf).
- **Modal Layar Penuh (Full Screen)**: Modal Tambah & Ubah dirancang full-screen dengan warna latar kontras pada header dan footer serta tombol aksi (Batal & Simpan) di kanan footer.
- **TOAST UI Editor**: Form konten artikel didukung editor Markdown kaya fitur.
- **AI Article Generator**: Penghasil draf artikel instan dengan validasi input angka kuantitas (1–5) dan integrasi OpenAI API.
- **Ekspor & Impor Excel**: Ekspor artikel ke format XLSX dan impor artikel batch dari spreadsheet.
- **Manajemen Sampul (Cover Image)**: Unggah dan hapus berkas gambar sampul artikel.
- **Pengaturan Profil**: Ubah nama dan alamat surel penulis.

### 3. Tingkatan Administrator
- **Kelola Pengguna (`/admin/users`)**: Daftar akun terdaftar, peran akun, dan statistik produktivitas artikel per pengguna.
- **Monitoring Artikel Pengguna (`/admin/users/{user}/posts`)**: Pemantauan artikel milik pengguna tertentu secara read-only dan ekspor ke Excel.
- **Monitoring Seluruh Artikel (`/admin/posts`)**: Pemantauan artikel seluruh sistem secara read-only dan ekspor menyeluruh ke Excel.

---

## Teknologi yang Digunakan
- **Backend**: Laravel 13, PHP 8.4
- **Frontend**: React 18, Inertia.js v2, Tailwind CSS v4, Lucide React
- **Markdown**: `@toast-ui/editor` (Editor & Viewer)
- **Basis Data**: PostgreSQL (pabwe_p8_blog)
- **Spreadsheet**: PhpOffice/PhpSpreadsheet
- **AI Integration**: OpenAI API (gpt-4o-mini)
- **Testing**: PHPUnit 12

---

## Struktur Folder (Feature-First)
```
app/
├── Features/
│   ├── Admin/
│   │   ├── Controllers/
│   │   │   └── AdminUserController.php
│   │   └── Services/
│   │       └── AdminUserService.php
│   ├── Ai/
│   │   ├── Contracts/
│   │   │   └── AiClientInterface.php
│   │   ├── DTO/
│   │   │   └── GeneratedPostItem.php
│   │   └── Services/
│   │       └── OpenAiPostGeneratorService.php
│   ├── Auth/
│   │   ├── Actions/
│   │   │   ├── LoginUserAction.php
│   │   │   └── RegisterUserAction.php
│   │   └── Controllers/
│   │       └── AuthController.php
│   ├── Post/
│   │   ├── Contracts/
│   │   │   └── PostRepositoryInterface.php
│   │   ├── Controllers/
│   │   │   ├── AdminPostController.php
│   │   │   ├── PostController.php
│   │   │   └── PublicPostController.php
│   │   ├── Enums/
│   │   │   └── PostCategory.php
│   │   ├── Models/
│   │   │   └── Post.php
│   │   ├── Policies/
│   │   │   └── PostPolicy.php
│   │   ├── Repositories/
│   │   │   └── PostRepository.php
│   │   └── Services/
│   │       ├── PostExcelService.php
│   │       └── PostService.php
│   └── Profile/
│       ├── Controllers/
│       │   └── ProfileController.php
│       └── Services/
│           └── ProfileService.php
├── Http/
│   ├── Controllers/Controller.php
│   └── Middleware/
│       ├── EnsurePostOwnership.php
│       ├── EnsureRole.php
│       └── HandleInertiaRequests.php
├── Models/User.php
└── Providers/AppServiceProvider.php
```

---

## Daftar Rute Aplikasi

| Method | URI | Hak Akses | Keterangan |
|---|---|---|---|
| `GET` | `/` | Publik (Guest) | Beranda galeri artikel blog publik |
| `GET` | `/articles` | Publik (Guest) | Daftar artikel publik + search + filter |
| `GET` | `/articles/{slug}` | Publik (Guest) | Pembaca artikel publik (Markdown Viewer) |
| `GET` | `/login`, `/register` | Guest | Halaman autentikasi |
| `POST` | `/login`, `/register` | Guest | Proses autentikasi |
| `POST` | `/logout` | Authenticated | Logout sesi pengguna |
| `GET` | `/dashboard/posts` | Member | Daftar artikel penulis sendiri (List View) |
| `POST` | `/dashboard/posts` | Member | Simpan artikel baru |
| `GET` | `/dashboard/posts/{post}` | Member | Detail artikel penulis |
| `PUT` | `/dashboard/posts/{post}` | Member | Perbarui artikel penulis |
| `DELETE` | `/dashboard/posts/{post}` | Member | Hapus artikel |
| `PATCH` | `/dashboard/posts/{post}/publish` | Member | Toggle publikasi (Draft ↔ Published) |
| `POST` | `/dashboard/posts/{post}/cover` | Member | Unggah foto sampul cover |
| `DELETE` | `/dashboard/posts/{post}/cover` | Member | Hapus foto sampul |
| `GET` | `/dashboard/posts/export` | Member | Ekspor artikel sendiri ke Excel |
| `POST` | `/dashboard/posts/import` | Member | Impor artikel dari Excel |
| `POST` | `/dashboard/posts/ai-generate` | Member | Hasilkan draf artikel via OpenAI |
| `POST` | `/dashboard/posts/ai-save` | Member | Simpan batch artikel hasil AI |
| `GET` | `/profile` | Authenticated | Edit profil penulis |
| `PUT` | `/profile` | Authenticated | Simpan perubahan profil |
| `GET` | `/admin/users` | Admin | Kelola daftar pengguna sistem |
| `GET` | `/admin/users/{user}/posts` | Admin | Monitoring artikel user tertentu (read-only) |
| `GET` | `/admin/users/{user}/posts/export` | Admin | Ekspor artikel user tertentu ke Excel |
| `GET` | `/admin/posts` | Admin | Monitoring seluruh artikel sistem |
| `GET` | `/admin/posts/export` | Admin | Ekspor semua artikel sistem ke Excel |

---

## Instalasi & Menjalankan Aplikasi

1. **Clone Repositori**:
   ```bash
   git clone git@github.com:yogitm/ifs24023-pabwe2026-sk-p8-laravel-inertia.git
   cd ifs24023-pabwe2026-sk-p8-laravel-inertia
   ```

2. **Instal Dependensi PHP & Frontend**:
   ```bash
   composer install
   npm install --ignore-scripts
   ```

3. **Konfigurasi Lingkungan**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Konfigurasi Basis Data PostgreSQL**:
   Pastikan PostgreSQL berjalan dan database dibuat:
   ```bash
   psql -U postgres -c "CREATE DATABASE pabwe_p8_blog;"
   ```
   Jalankan migrasi dan seeding:
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```

5. **Build Asset & Jalankan Server**:
   ```bash
   npm run build
   php artisan serve
   ```
   Buka peramban di `http://127.0.0.1:8000`.

---

## Akun Pengguna Default
- **Administrator**: `admin@blogverse.test` / `password`
- **Penulis (Member)**: `member@blogverse.test` / `password`

---

## Pengujian & Jaminan Mutu

```bash
# Menjalankan seluruh pengujian unit & feature
php artisan test

# Audit keamanan dependensi
composer audit
```

- **ID Elemen Form Login**: Wajib memiliki `id="login-username"`, `id="login-password"`, dan `id="login-submit"`.
- **Integritas Storage**: Seluruh subdirektori `storage/framework/` dan `storage/logs/` dipertahankan di git menggunakan `.gitignore` berisi `*` dan `!.gitignore`.
- **Composer Audit**: 0 security vulnerabilities.
