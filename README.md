# OpenMusic API

**OpenMusic API** merupakan proyek akhir dari kelas **Belajar Fundamental Back-End dengan JavaScript**. Proyek ini bertujuan untuk membangun **RESTful API** dengan menerapkan berbagai teknologi backend, termasuk **database, storage, message broker, dan caching**. Selain itu, API ini juga dilengkapi dengan fitur authentication dan authorization untuk memastikan keamanan akses data.


## Features

OpenMusic API menyediakan berbagai fitur untuk mengelola lagu dan playlist, termasuk:
-  **Menambahkan Lagu** – Pengguna dapat menambahkan lagu ke dalam sistem dengan informasi seperti judul, artis, dan album.
-  **Membuat Playlist** – Memungkinkan pengguna untuk membuat playlist pribadi untuk mengelompokkan lagu sesuai keinginan.
-  **Menambahkan Lagu ke Playlist** – Lagu yang sudah terdaftar dapat dimasukkan ke dalam playlist tertentu.
-  **Membagikan Playlist** – Pengguna dapat membagikan playlist kepada pengguna lain dengan mekanisme akses yang aman.
- **Authentication & Authorization** – Setiap operasi dalam API memerlukan autentikasi, dan hanya pengguna yang berhak yang dapat mengakses atau mengubah playlist.
- **Efisiensi Data dengan Caching** – Memanfaatkan caching untuk meningkatkan performa dalam pengambilan data.
- **Message Broker untuk Sinkronisasi Data** – Menggunakan message broker untuk memastikan data tetap sinkron dalam berbagai layanan.

> **Note:** Aplikasi ini berfokus pada pengelolaan data lagu dan playlist layaknya aplikasi catatan (**notes app**) dan **tidak mencakup penyimpanan atau streaming file audio (MP3).**

## Tech Stack

-  **Backend:** Hapi.js, Node.js
-  **Database:** PostgreSQL, node-pg-migrate, pg
-  **Authentication & Authorization:** JWT (@hapi/jwt), bcrypt
-  **Data Caching:** Redis
-  **Message Broker:** RabbitMQ (amqplib)
-  **Validation:** Joi

## How to Run

Langkah untuk menjalankan OpenMusic API di lokal:

### Clone Repository
1. Clone repositori API:
	```
	git clone https://github.com/mufidfarhan/open-music-api
	```
2. Clone repositori Consumer:
	```
	git clone https://github.com/mufidfarhan/open-music-consumer
	```

### Run API

1. Masuk ke direktori Consumer:
	```
	cd open-music-api
	```
2. Instal Dependencies:
	```
	npm install
	```
3. Konfigurasi Environment Variables\
	Buat file .env di root proyek dan isi dengan konfigurasi berikut:
	```
	HOST=localhost
	PORT=5000
	PGUSER=your_postgres_user
	PGHOST=localhost
	PGPASSWORD=your_postgres_password
	PGDATABASE=open-music
	PGPORT=5433
	ACCESS_TOKEN_KEY=your_access_token_key
	REFRESH_TOKEN_KEY=your_refresh_token_key
	ACCESS_TOKEN_AGE=18000
	RABBITMQ_SERVER=amqp://localhost
	REDIS_SERVER=127.0.0.1
	```
	> **Note:** Sesuaikan nilai variabel dengan konfigurasi sistem.
4. Jalankan Migrasi Database\
	Sebelum menjalankan aplikasi, pastikan database sudah dimigrasikan dengan perintah berikut:
	```
	npm run migrate up
	```
5. Menjalankan Server API:
	```
	npm run start
	```

### Run Consumer

1. Masuk ke direktori Consumer:
	```
	cd open-music-consumer
	```
2. Install dependencies:
	```
	npm install
	```
3. Jalankan Consumer:
	```
	npm run start
	```