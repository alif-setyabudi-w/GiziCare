-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Jun 2026 pada 11.56
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rekomendasi_gizi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `konsultasi`
--

CREATE TABLE `konsultasi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `usia` int(11) NOT NULL,
  `jenis_kelamin` enum('pria','wanita') NOT NULL,
  `berat` decimal(5,2) NOT NULL,
  `tinggi` decimal(5,2) NOT NULL,
  `aktivitas` enum('ringan','sedang','berat') NOT NULL,
  `tujuan` enum('naik','turun','seimbang') NOT NULL,
  `kategori` varchar(50) DEFAULT 'all',
  `catatan` text DEFAULT NULL,
  `status` enum('pending','diproses','selesai','ditolak') DEFAULT 'pending',
  `respons` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `konsultasi`
--
-- --------------------------------------------------------

--
-- Struktur dari tabel `konsumsi_makanan`
--

CREATE TABLE `konsumsi_makanan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `waktu_makan` enum('pagi','siang','sore','malam','minuman') NOT NULL,
  `nama_makanan` varchar(255) NOT NULL,
  `porsi` varchar(100) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rekomendasi`
--

CREATE TABLE `rekomendasi` (
  `id` int(11) NOT NULL,
  `petugas_id` int(11) NOT NULL,
  `konsultasi_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `nama_user` varchar(100) DEFAULT NULL,
  `email_user` varchar(100) DEFAULT NULL,
  `usia` int(11) DEFAULT NULL,
  `berat_badan` decimal(5,2) DEFAULT NULL,
  `tinggi_badan` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `jenis_kelamin` enum('pria','wanita') DEFAULT NULL,
  `aktivitas` enum('ringan','sedang','berat') DEFAULT NULL,
  `tujuan` enum('turun','naik','seimbang') DEFAULT NULL,
  `kategori` varchar(50) DEFAULT 'all',
  `bmr` decimal(8,2) DEFAULT NULL,
  `tdee` decimal(8,2) DEFAULT NULL,
  `target_calories` decimal(8,2) DEFAULT NULL,
  `target_protein_g` decimal(8,2) DEFAULT NULL,
  `target_lemak_g` decimal(8,2) DEFAULT NULL,
  `target_karbohidrat_g` decimal(8,2) DEFAULT NULL,
  `jumlah_rekomendasi` int(11) DEFAULT 10,
  `keterangan` text DEFAULT NULL,
  `status` enum('aktif','arsip') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rekomendasi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `rekomendasi_detail`
--

CREATE TABLE `rekomendasi_detail` (
  `id` int(11) NOT NULL,
  `rekomendasi_id` int(11) NOT NULL,
  `nama_makanan` varchar(255) NOT NULL,
  `kode_makanan` varchar(50) DEFAULT NULL,
  `energi_kal` decimal(8,2) DEFAULT NULL,
  `protein_g` decimal(8,2) DEFAULT NULL,
  `lemak_g` decimal(8,2) DEFAULT NULL,
  `karbohidrat_g` decimal(8,2) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `distance` decimal(10,6) DEFAULT NULL,
  `similarity_score` decimal(5,4) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rekomendasi_detail`
--
-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ahli_gizi','pasien') DEFAULT 'pasien',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password_hash`, `role`, `created_at`, `otp_code`, `otp_expires_at`, `is_verified`) VALUES
(16, 'Ahli Gizi Utama', 'petugas@gmail.com', '$2b$10$1cUH4FL9VCyEZatOM.l47e6aicbUNTMOhTC1yizBjrqIRr84sUSGK', 'ahli_gizi', '2026-06-15 16:13:03', NULL, NULL, 1),

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indeks untuk tabel `konsumsi_makanan`
--
ALTER TABLE `konsumsi_makanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_tanggal` (`tanggal`),
  ADD KEY `idx_waktu` (`waktu_makan`);

--
-- Indeks untuk tabel `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_petugas` (`petugas_id`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `konsultasi_id` (`konsultasi_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `rekomendasi_detail`
--
ALTER TABLE `rekomendasi_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rekomendasi` (`rekomendasi_id`),
  ADD KEY `idx_rank` (`rank`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_otp_code` (`otp_code`),
  ADD KEY `idx_email_verification` (`email`,`is_verified`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `konsumsi_makanan`
--
ALTER TABLE `konsumsi_makanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `rekomendasi`
--
ALTER TABLE `rekomendasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT untuk tabel `rekomendasi_detail`
--
ALTER TABLE `rekomendasi_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=398;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `konsultasi`
--
ALTER TABLE `konsultasi`
  ADD CONSTRAINT `konsultasi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `konsumsi_makanan`
--
ALTER TABLE `konsumsi_makanan`
  ADD CONSTRAINT `konsumsi_makanan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD CONSTRAINT `rekomendasi_ibfk_1` FOREIGN KEY (`petugas_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rekomendasi_ibfk_2` FOREIGN KEY (`konsultasi_id`) REFERENCES `konsultasi` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `rekomendasi_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rekomendasi_detail`
--
ALTER TABLE `rekomendasi_detail`
  ADD CONSTRAINT `rekomendasi_detail_ibfk_1` FOREIGN KEY (`rekomendasi_id`) REFERENCES `rekomendasi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
