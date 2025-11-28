-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 28, 2025 at 08:58 AM
-- Server version: 5.7.23-23
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kbsoluti_taekwondo`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late','excused') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `student_id`, `date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-01-15', 'present', 'Regular training session', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(2, 1, '2024-01-17', 'present', 'Belt promotion practice', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(3, 2, '2024-01-15', 'present', 'Technique training', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(4, 2, '2024-01-17', 'absent', 'Sick leave', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(5, 3, '2024-01-15', 'present', 'Advanced training', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(6, 3, '2024-01-17', 'present', 'Competition preparation', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(7, 3, '2021-08-24', 'present', NULL, '2025-08-25 09:07:07', '2025-08-25 09:07:07'),
(8, 3, '2025-08-25', 'present', NULL, '2025-08-25 09:07:14', '2025-08-25 09:07:14'),
(9, 3, '2025-08-24', 'present', NULL, '2025-08-25 09:07:15', '2025-08-25 09:07:15'),
(10, 3, '2025-08-22', 'present', NULL, '2025-08-25 09:07:17', '2025-08-25 09:07:17'),
(11, 2, '2025-09-01', 'present', NULL, '2025-09-08 11:28:57', '2025-09-08 11:28:57'),
(12, 7, '2025-09-02', 'present', NULL, '2025-09-09 13:00:28', '2025-09-09 13:00:28'),
(13, 7, '2025-09-04', 'present', NULL, '2025-09-09 13:00:32', '2025-09-09 13:00:32'),
(14, 7, '2025-09-03', 'absent', NULL, '2025-09-09 13:00:36', '2025-09-09 13:00:54'),
(15, 7, '2025-09-14', 'present', NULL, '2025-09-09 13:00:38', '2025-09-09 13:00:38'),
(16, 7, '2025-09-15', 'present', NULL, '2025-09-09 13:00:45', '2025-09-09 13:00:45'),
(17, 7, '2025-09-06', 'present', NULL, '2025-09-09 13:00:53', '2025-09-09 13:00:53'),
(18, 7, '2025-09-08', 'present', NULL, '2025-09-09 13:01:01', '2025-09-09 13:01:01'),
(19, 8, '2025-09-01', 'present', NULL, '2025-09-19 02:14:05', '2025-09-19 02:14:05'),
(20, 8, '2025-09-02', 'present', NULL, '2025-09-19 02:14:06', '2025-09-19 02:14:06'),
(21, 8, '2025-09-03', 'present', NULL, '2025-09-19 02:14:08', '2025-09-19 02:14:08'),
(22, 8, '2025-09-04', 'present', NULL, '2025-09-19 02:14:10', '2025-09-19 02:14:10'),
(23, 8, '2025-09-07', 'present', NULL, '2025-09-19 02:14:13', '2025-09-19 02:14:13'),
(24, 8, '2025-09-09', 'present', NULL, '2025-09-19 02:14:15', '2025-09-19 02:14:15'),
(25, 8, '2025-09-12', 'present', NULL, '2025-09-19 02:14:18', '2025-09-19 02:14:18'),
(26, 8, '2025-09-13', 'present', NULL, '2025-09-19 02:14:20', '2025-09-19 02:14:20'),
(27, 8, '2025-09-19', 'present', NULL, '2025-09-19 02:14:23', '2025-09-19 02:14:23'),
(28, 8, '2025-09-20', 'present', NULL, '2025-09-19 02:14:26', '2025-09-19 02:14:29'),
(29, 14, '2025-11-01', 'present', NULL, '2025-11-03 09:13:56', '2025-11-03 09:13:56'),
(30, 14, '2025-11-02', 'present', NULL, '2025-11-03 09:13:58', '2025-11-03 09:13:58'),
(31, 14, '2025-11-03', 'present', NULL, '2025-11-03 09:14:00', '2025-11-03 09:14:00'),
(32, 14, '2025-11-04', 'present', NULL, '2025-11-03 09:14:02', '2025-11-03 09:14:02'),
(33, 14, '2025-10-01', 'present', NULL, '2025-11-03 09:14:08', '2025-11-03 09:14:08'),
(34, 14, '2025-10-02', 'present', NULL, '2025-11-03 09:14:10', '2025-11-03 09:14:10'),
(35, 14, '2025-10-03', 'present', NULL, '2025-11-03 09:14:12', '2025-11-03 09:14:12'),
(36, 14, '2025-10-05', 'present', NULL, '2025-11-03 09:14:15', '2025-11-03 09:14:15'),
(37, 14, '2025-10-06', 'present', NULL, '2025-11-03 09:14:17', '2025-11-03 09:14:17'),
(38, 14, '2025-10-07', 'present', NULL, '2025-11-03 09:14:18', '2025-11-03 09:14:18'),
(39, 14, '2025-10-09', 'present', NULL, '2025-11-03 09:14:24', '2025-11-03 09:14:24'),
(40, 14, '2025-10-10', 'present', NULL, '2025-11-03 09:14:26', '2025-11-03 09:14:26'),
(41, 14, '2025-10-11', 'present', NULL, '2025-11-03 09:14:32', '2025-11-03 09:14:32'),
(42, 14, '2025-10-12', 'present', NULL, '2025-11-03 09:14:34', '2025-11-03 09:14:34'),
(43, 14, '2025-11-06', 'present', NULL, '2025-11-03 09:16:25', '2025-11-03 09:16:25'),
(44, 14, '2025-10-16', 'present', NULL, '2025-11-03 09:16:34', '2025-11-03 09:16:40'),
(45, 14, '2025-10-15', 'present', NULL, '2025-11-03 09:16:37', '2025-11-03 09:16:37'),
(46, 14, '2025-10-14', 'present', NULL, '2025-11-03 09:16:38', '2025-11-03 09:16:38');

-- --------------------------------------------------------

--
-- Table structure for table `bank_information`
--

CREATE TABLE `bank_information` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `iban` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `swift_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MYR',
  `userable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userable_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank_information`
--

INSERT INTO `bank_information` (`id`, `bank_name`, `account_name`, `account_number`, `iban`, `swift_code`, `branch`, `currency`, `userable_type`, `userable_id`, `created_at`, `updated_at`) VALUES
(1, 'Marvin Rojas', 'Bruno Langley', '959', 'Magnam et cumque duc', 'Sunt necessitatibus', 'Esse rerum est repr', 'JPY', 'App\\Models\\User', 1, '2025-09-30 06:14:17', '2025-09-30 06:14:17'),
(2, 'Quin Marks', 'Logan Willis', '593', 'Aut perferendis veni', 'Quibusdam id qui off', 'Tenetur in dolorum d', 'CAD', 'App\\Models\\User', 4, '2025-09-30 06:24:37', '2025-09-30 06:24:37'),
(3, 'Serina Bryant', 'Autumn Mills', '746', 'Dolores velit invent', 'A ipsum deleniti au', 'Accusamus sit enim n', 'EUR', 'App\\Models\\User', 5, '2025-09-30 06:35:16', '2025-09-30 06:35:16'),
(4, 'Maybank', 'Taekwondo Academy', '1234567890', 'MY12345678901234567890', 'MBBEMYKL', 'Kuala Lumpur Main Branch', 'MYR', 'App\\Models\\User', 1, '2025-09-30 06:51:50', '2025-09-30 06:51:50'),
(5, 'CIMB Bank', 'Taekwondo Academy', '0987654321', 'MY09876543210987654321', 'CIBBMYKL', 'Petaling Jaya Branch', 'MYR', 'App\\Models\\User', 1, '2025-09-30 06:51:50', '2025-09-30 06:51:50'),
(6, 'HSBC Bank', 'Taekwondo Academy', '1122334455', 'MY11223344551122334455', 'HBSCMYKL', 'Kuala Lumpur Branch', 'USD', 'App\\Models\\User', 1, '2025-09-30 06:51:50', '2025-09-30 06:51:50'),
(7, 'Guy Robertson', 'Abbot Wooten', '893', 'Voluptatem Accusant', 'Aut cillum minim non', 'Earum culpa corporis', 'MYR', 'App\\Models\\User', 4, '2025-09-30 07:11:42', '2025-09-30 07:11:42'),
(8, 'Mia Moses', 'Carolyn Hartman', '582', 'Qui fuga Autem vel', 'Necessitatibus est c', 'Et explicabo Ullam', 'MYR', 'App\\Models\\User', 4, '2025-09-30 07:17:24', '2025-09-30 07:17:24'),
(9, 'Melanie Clarke', 'Rae Casey', '543', 'Quos eum aperiam qui', 'Qui aliquip facilis', 'Est facere numquam', 'EUR', 'App\\Models\\User', 5, '2025-09-30 07:27:47', '2025-09-30 07:27:47'),
(10, 'Abbot Reed', 'Bryar Holden', '457', 'Voluptas aliqua Ips', 'Suscipit qui perspic', 'Eius nulla libero ut', 'GBP', 'App\\Models\\User', 1, '2025-09-30 07:39:49', '2025-09-30 07:39:49'),
(11, 'CIMB', 'MYHIGHST BUSINESS SERVICES', '8004487846', NULL, NULL, 'PD', 'MYR', 'App\\Models\\User', 7, '2025-09-30 15:11:23', '2025-09-30 15:11:23'),
(12, 'HCB', 'yahooclubbank', '23424242424234', '3242342423452524524', '342234', 'PORT DICKSON', 'MYR', 'App\\Models\\User', 31, '2025-10-20 08:13:22', '2025-10-20 08:13:22'),
(13, 'CIMB', 'MYHIGHST BUSINESS SERVICES', '8004487846', '23434244654645646', '345435', 'PD', 'MYR', 'App\\Models\\User', 6, '2025-11-03 08:22:37', '2025-11-03 08:22:37'),
(14, 'BSN', 'KAMRAN TKD ASSOCIATION', '5050434325670', 'BSNEWSDDFS', '345435', 'SEREMBAN 2', 'MYR', 'App\\Models\\User', 39, '2025-11-03 09:18:37', '2025-11-03 09:18:37');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('admin@example.com|109.63.56.107', 'i:1;', 1762144663),
('admin@example.com|109.63.56.107:timer', 'i:1762144663;', 1762144663),
('admin@example.com|109.63.56.45', 'i:3;', 1760356131),
('admin@example.com|109.63.56.45:timer', 'i:1760356131;', 1760356131),
('admin@example.com|154.81.248.21', 'i:1;', 1756118569),
('admin@example.com|154.81.248.21:timer', 'i:1756118569;', 1756118569),
('admin@example.com|37.131.105.208', 'i:2;', 1763121487),
('admin@example.com|37.131.105.208:timer', 'i:1763121487;', 1763121487),
('admin@example.com|37.131.109.36', 'i:1;', 1758432257),
('admin@example.com|37.131.109.36:timer', 'i:1758432257;', 1758432257),
('admin@example.com|37.131.42.4', 'i:1;', 1759248975),
('admin@example.com|37.131.42.4:timer', 'i:1759248975;', 1759248975),
('admin@example.com|37.131.44.158', 'i:1;', 1760967250),
('admin@example.com|37.131.44.158:timer', 'i:1760967250;', 1760967250),
('admin@tkd.com|37.131.109.36', 'i:1;', 1758432265),
('admin@tkd.com|37.131.109.36:timer', 'i:1758432265;', 1758432265),
('club.kltaekwon-docenter@tkd.com|154.198.116.233', 'i:2;', 1763548016),
('club.kltaekwon-docenter@tkd.com|154.198.116.233:timer', 'i:1763548016;', 1763548016),
('info@rmaamartialarts.com|154.81.254.124', 'i:1;', 1759192413),
('info@rmaamartialarts.com|154.81.254.124:timer', 'i:1759192413;', 1759192413),
('instructor1@example.com|109.63.56.45', 'i:1;', 1760357838),
('instructor1@example.com|109.63.56.45:timer', 'i:1760357838;', 1760357838),
('kamranclub1@google.com|37.131.42.4', 'i:1;', 1759257824),
('kamranclub1@google.com|37.131.42.4:timer', 'i:1759257824;', 1759257824),
('kelantan@mtf.com|60.49.50.252', 'i:1;', 1762181815),
('kelantan@mtf.com|60.49.50.252:timer', 'i:1762181815;', 1762181815),
('kelantanmtf@mtf.com|60.49.50.252', 'i:2;', 1762181826),
('kelantanmtf@mtf.com|60.49.50.252:timer', 'i:1762181826;', 1762181826),
('org.malaysiantaekwon-dofederation@tkd.com|109.63.56.107', 'i:1;', 1762144534),
('org.malaysiantaekwon-dofederation@tkd.com|109.63.56.107:timer', 'i:1762144534;', 1762144534),
('org.malaysiantaekwon-dofederation@tkd.com|109.63.56.45', 'i:1;', 1760334725),
('org.malaysiantaekwon-dofederation@tkd.com|109.63.56.45:timer', 'i:1760334725;', 1760334725),
('org.malaysiantaekwon-dofederation@tkd.com|118.100.95.32', 'i:1;', 1757348854),
('org.malaysiantaekwon-dofederation@tkd.com|118.100.95.32:timer', 'i:1757348854;', 1757348854),
('org.malaysiantaekwon-dofederation@tkd.com|154.91.163.159', 'i:1;', 1761724183),
('org.malaysiantaekwon-dofederation@tkd.com|154.91.163.159:timer', 'i:1761724183;', 1761724183),
('org.malaysiantaekwon-dofederation@tkd.com|175.107.204.155', 'i:2;', 1762150031),
('org.malaysiantaekwon-dofederation@tkd.com|175.107.204.155:timer', 'i:1762150031;', 1762150031),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.106.21', 'i:1;', 1761555104),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.106.21:timer', 'i:1761555104;', 1761555104),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.107.44', 'i:1;', 1757775101),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.107.44:timer', 'i:1757775101;', 1757775101),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.109.195', 'i:3;', 1757349208),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.109.195:timer', 'i:1757349208;', 1757349208),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.110.73', 'i:1;', 1758286054),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.110.73:timer', 'i:1758286054;', 1758286054),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.42.61', 'i:1;', 1760527940),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.42.61:timer', 'i:1760527940;', 1760527940),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.43.138', 'i:2;', 1756136640),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.43.138:timer', 'i:1756136640;', 1756136640),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.44.210', 'i:1;', 1756971800),
('org.malaysiantaekwon-dofederation@tkd.com|37.131.44.210:timer', 'i:1756971800;', 1756971800),
('org.malaysiantaekwon-dofederation@tkd.com|60.49.50.252', 'i:1;', 1762178845),
('org.malaysiantaekwon-dofederation@tkd.com|60.49.50.252:timer', 'i:1762178845;', 1762178845),
('org.selangortaekwon-doassociation@tkd.com|37.131.44.210', 'i:1;', 1756971771),
('org.selangortaekwon-doassociation@tkd.com|37.131.44.210:timer', 'i:1756971771;', 1756971771),
('org@example.com|109.63.56.107', 'i:1;', 1762144529),
('org@example.com|109.63.56.107:timer', 'i:1762144529;', 1762144529),
('org@example.com|118.100.95.32', 'i:5;', 1757236229),
('org@example.com|118.100.95.32:timer', 'i:1757236229;', 1757236229),
('org@example.com|175.107.204.155', 'i:1;', 1762150065),
('org@example.com|175.107.204.155:timer', 'i:1762150065;', 1762150065),
('org@example.com|37.131.106.21', 'i:1;', 1761555159),
('org@example.com|37.131.106.21:timer', 'i:1761555159;', 1761555159),
('org@example.com|37.131.109.175', 'i:1;', 1757236310),
('org@example.com|37.131.109.175:timer', 'i:1757236310;', 1757236310),
('organization@app.test|154.91.163.159', 'i:1;', 1761724104),
('organization@app.test|154.91.163.159:timer', 'i:1761724104;', 1761724104),
('organization@app.test|175.107.204.155', 'i:1;', 1762150053),
('organization@app.test|175.107.204.155:timer', 'i:1762150053;', 1762150053),
('rkb@myhighst.com.my|207.244.71.81', 'i:1;', 1756133766),
('rkb@myhighst.com.my|207.244.71.81:timer', 'i:1756133766;', 1756133766),
('sas@hotmail.com|207.244.71.81', 'i:2;', 1756133285),
('sas@hotmail.com|207.244.71.81:timer', 'i:1756133285;', 1756133285),
('sensei.wong@tkd.com|37.131.109.195', 'i:1;', 1757350371),
('sensei.wong@tkd.com|37.131.109.195:timer', 'i:1757350371;', 1757350371),
('yahooclub_instructor01@yahoo.com|37.131.105.174', 'i:1;', 1763462088),
('yahooclub_instructor01@yahoo.com|37.131.105.174:timer', 'i:1763462088;', 1763462088),
('yahooclub_instructor01@yahoo.com|37.131.106.21', 'i:1;', 1761555196),
('yahooclub_instructor01@yahoo.com|37.131.106.21:timer', 'i:1761555196;', 1761555196),
('yahooclub_instructor01@yahoo.com|37.131.111.114', 'i:1;', 1761903868),
('yahooclub_instructor01@yahoo.com|37.131.111.114:timer', 'i:1761903868;', 1761903868),
('yahooclub_instructor01@yahoo.com|37.131.44.193', 'i:1;', 1762887572),
('yahooclub_instructor01@yahoo.com|37.131.44.193:timer', 'i:1762887572;', 1762887572);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `issued_at` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `certifications`
--

INSERT INTO `certifications` (`id`, `student_id`, `issued_at`, `notes`, `file`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-01-15', 'Red Belt certification completed successfully', 'certificates/red_belt_cert_001.pdf', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(2, 2, '2024-02-20', 'Blue Belt certification with excellent performance', 'certificates/blue_belt_cert_002.pdf', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(3, 3, '2024-03-10', 'Black Belt 1st Dan certification - Outstanding achievement', 'certificates/black_belt_1st_dan_003.pdf', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(4, 1, '2025-08-26', 'Red Belt certification completed successfully', 'certificates/3AY7FFIUmGE2W9fI13RUlUVmZuzrmHrWl1j6fKkZ.pdf', '2025-08-26 07:47:32', '2025-08-26 07:47:56');

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `organization_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tax_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_prefix` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notification_emails` tinyint(1) NOT NULL DEFAULT '0',
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `default_currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MYR',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `organization_id`, `name`, `tax_number`, `invoice_prefix`, `logo`, `phone`, `notification_emails`, `website`, `postal_code`, `city`, `street`, `country`, `status`, `default_currency`, `created_at`, `updated_at`) VALUES
(1, 1, 'KL Taekwon-Do Center Manager', NULL, NULL, 'https://taekwondo.kbsolutions.agency/public/storage/clubs/Ddg3zSWRUzzA0E0waG4Li7D1tsu2xTzpCdA5sXkf.png', '+603-1234-1111', 0, 'https://www.kltkd.com', '55100', 'Kuala Lumpur', '123 Jalan Bukit Bintang', 'Malaysia', 1, 'EUR', '2025-08-21 07:34:37', '2025-10-29 02:21:50'),
(2, 2, 'Shah Alam Martial Arts Club', NULL, NULL, NULL, '+603-9876-2222', 0, 'https://www.samartialarts.com', '40100', 'Shah Alam', '456 Jalan Subang', 'Malaysia', 1, 'MYR', '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(3, 3, 'Penang Combat Academy', NULL, NULL, NULL, '+604-1111-3333', 0, 'https://www.penangcombat.com', '10250', 'George Town', '789 Jalan Gurney', 'Malaysia', 1, 'MYR', '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(4, 3, 'Perak TKD', NULL, NULL, 'https://taekwondo.kbsolutions.agency/public/storage/clubs/c2ZKN8UuDk5naNFUPityJE0FMQsvFUmvWm55Rp12.jpg', '0102913680', 1, 'www.ssds.com', '71050', 'BANDAR TELOK KEMANG,', 'LOTS 1944 JALAN PANTAI 3, TANJUNG TANAH MERAH, BANDAR TELOK KEMANG, DAERAH PORT DICKSON, NEGERI SEMBILAN DARUL KHUSUS', 'AFG', 1, 'MYR', '2025-08-25 09:14:42', '2025-08-25 09:14:42'),
(5, 2, 'Revolution Martial Arts Academy', NULL, NULL, NULL, '0102913680', 1, 'rmaamartialarts.com', '70300', 'Seremban', 'Garden Homes', 'MYS', 1, 'MYR', '2025-09-09 12:49:48', '2025-09-09 12:49:48'),
(6, 4, 'BENJAMIN CLUB1', NULL, 'MTFBC', NULL, '0122888688', 1, 'mtf.com', '71950', 'Seremban', 'Bandar Sri Sendayan', 'MYS', 1, 'MYR', '2025-09-19 02:04:32', '2025-09-19 02:04:32'),
(7, 1, 'yahooclub', '2342342', '00346', 'https://taekwondo.kbsolutions.agency/public/storage/clubs/5ULhqbeYBdMRd4YjAF3ORSc9D1uFMxqTCBcyRok9.png', '22342424', 1, NULL, '234242', 'kalampur', 'kalampur', 'MYS', 1, 'MYR', '2025-10-20 08:05:10', '2025-10-20 08:05:10'),
(8, 3, 'BENJAMIN CLUB TKD', NULL, NULL, 'https://taekwondo.kbsolutions.agency/public/storage/clubs/JsUslcdESexN5yPfCbMexYXYNWjvEjObqxAXS4qL.jpg', '0102345400', 0, NULL, '71950', 'Seremban', '560 ,BBS 3/25 Hijayu 3, Hijayu 3A ,Bandar Sri Sendayan', 'MYS', 1, 'MYR', '2025-11-03 08:50:27', '2025-11-03 08:50:27'),
(9, 6, 'Kamran TKD', NULL, NULL, NULL, '0176503849', 0, NULL, '71200', 'Rantau', 'Lot 5029,Jalan Besar , Rantau to Linggi', 'MYS', 1, 'MYR', '2025-11-03 09:06:43', '2025-11-03 09:06:43');

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `decimal_places` int(11) NOT NULL DEFAULT '2',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `code`, `name`, `symbol`, `decimal_places`, `is_active`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 'MYR', 'Malaysian Ringgit', 'RM', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-22 08:36:09'),
(2, 'USD', 'US Dollar', '$', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(3, 'EUR', 'Euro', '€', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(4, 'GBP', 'British Pound', '£', 2, 1, 0, '2025-08-21 07:34:37', '2025-09-08 11:10:00'),
(5, 'SGD', 'Singapore Dollar', 'S$', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(6, 'AUD', 'Australian Dollar', 'A$', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-22 08:48:39'),
(7, 'CAD', 'Canadian Dollar', 'C$', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(8, 'JPY', 'Japanese Yen', '¥', 0, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(9, 'CNY', 'Chinese Yuan', '¥', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(10, 'INR', 'Indian Rupee', '₹', 2, 1, 0, '2025-08-21 07:34:37', '2025-08-21 07:34:37');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `organization_id` bigint(20) UNSIGNED NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'training',
  `event_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `venue` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('upcoming','ongoing','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'upcoming',
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `club_id`, `organization_id`, `created_by`, `title`, `description`, `event_type`, `event_date`, `start_time`, `end_time`, `venue`, `status`, `is_public`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 5, 'Soluta nihil exercit', 'Blanditiis inventore', 'other', '2025-10-31', '12:00:00', '23:00:00', 'Quia sunt dolor aut', 'upcoming', 1, NULL, '2025-10-29 01:10:59', '2025-10-29 01:40:53'),
(2, 7, 1, 31, 'Malaysian Taekwon event test', 'Malaysian Taekwon event test', 'training', '2025-11-27', '01:55:00', '09:55:00', 'malaysia', 'ongoing', 1, NULL, '2025-10-29 01:36:06', '2025-10-29 01:37:40'),
(3, 7, 1, 31, 'google testing abc', 'google testing abc', 'competition', '2025-11-29', '01:55:00', '22:50:00', 'malaysia', 'upcoming', 1, NULL, '2025-11-02 23:24:56', '2025-11-02 23:24:56'),
(4, 2, 2, 6, 'information against multiple', 'information against multiple', 'meeting', '2025-11-27', '10:00:00', '23:35:00', 'test', 'upcoming', 1, NULL, '2025-11-03 08:30:54', '2025-11-03 08:30:54');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ic_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization_id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `name`, `gender`, `ic_number`, `email`, `address`, `mobile`, `grade`, `profile_picture`, `organization_id`, `club_id`, `created_at`, `updated_at`) VALUES
(1, 'Master Lim', 'male', '800101-01-1234', 'master.lim@tkd.com', '123 Jalan Bukit Bintang, Kuala Lumpur', '+6012-111-2222', '6th Dan Black Belt', NULL, 1, 1, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(2, 'Sensei Wong', 'male', '850505-05-5678', 'sensei.wong@tkd.com', '456 Jalan Subang, Shah Alam', '+6012-333-4444', '4th Dan Black Belt', NULL, 2, 2, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(3, 'Coach Tan', 'male', '900909-09-9012', 'coach.tan@tkd.com', '789 Jalan Gurney, George Town', '+6012-555-6666', '3rd Dan Black Belt', '/storage/instructors/QQj4aNl04kAwYRNBOnvPVmTWQbGjUTscmjG3SHCs.jpg', 3, 3, '2025-08-21 07:34:37', '2025-10-13 06:30:54'),
(4, 'Jane Jayawardene', 'female', '1322131244131', 'xyasin@yahoo.com', NULL, '13123123131313', NULL, '/storage/instructors/bhf1kbZWdwdubBqRgcGMGI2sS9SoM2Bm1MBEYSDF.jpg', 2, 2, '2025-09-08 11:27:58', '2025-09-08 11:27:58'),
(5, 'Master Benjamin', 'male', '700509055133', 'rkb1@myhighst.com.my', 'LOTS 1944 JALAN PANTAI 3, TANJUNG TANAH MERAH, BANDAR TELOK KEMANG, DAERAH PORT DICKSON, NEGERI SEMBILAN DARUL KHUSUS', '01111919484', 'Black 2nd Dan', '/storage/instructors/vg7o6Of4h1yckpKs2X1b04IVzJUtyrDpMriEZA25.jpg', 2, 5, '2025-09-09 13:04:15', '2025-09-09 13:04:15'),
(6, 'Desmond', 'male', '959323051234', 'desmond@mtf.com', 'LOT 991/37 TOWN BATU 1 JALAN PANTAI ,HAPPY GARDEN', '0122526475', '1st Dan', '/storage/instructors/RoaNv558BozbgqiKk89fUpa1gk5uWxB7cICUUycY.jpg', 4, 6, '2025-09-19 02:16:14', '2025-09-19 02:16:14'),
(7, 'instructor01', 'male', '342342342342', 'yahooclub_instructor01@yahoo.com', 'asdad', '4324243242342', 'instructor', '/storage/instructors/n4G4F0MqiAXF1wr30XmTdBf3hH5ECsWSa2Mf1GP3.jpg', 1, 7, '2025-10-20 08:07:27', '2025-11-02 23:20:57'),
(8, 'Sifu Guna', 'male', '32323232323', 'guna@mtf.com', '146, Taman Bukit Ampangan', '0333432333', 'black', '/storage/instructors/TehnvHe8Np9XwXws6w81b2CA5towdpcK9qZGwif5.jpg', 6, 9, '2025-11-03 09:13:37', '2025-11-03 09:13:37');

-- --------------------------------------------------------

--
-- Table structure for table `instructor_student`
--

CREATE TABLE `instructor_student` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `instructor_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `instructor_student`
--

INSERT INTO `instructor_student` (`id`, `instructor_id`, `student_id`, `created_at`, `updated_at`) VALUES
(1, 4, 2, NULL, NULL),
(2, 4, 6, NULL, NULL),
(3, 5, 7, NULL, NULL),
(4, 6, 8, NULL, NULL),
(5, 3, 3, NULL, NULL),
(6, 1, 9, NULL, NULL),
(7, 7, 10, NULL, NULL),
(8, 2, 6, NULL, NULL),
(9, 2, 2, NULL, NULL),
(10, 8, 14, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `longitude` decimal(10,7) NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `location_images`
--

CREATE TABLE `location_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `location_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(18, '0001_01_01_000000_create_users_table', 1),
(19, '0001_01_01_000001_create_cache_table', 1),
(20, '0001_01_01_000002_create_jobs_table', 1),
(21, '2025_01_15_000000_create_ratings_table', 1),
(22, '2025_01_16_000000_create_currencies_table', 1),
(23, '2025_03_03_130021_create_locations_table', 1),
(24, '2025_04_13_132100_create_students_table', 1),
(25, '2025_04_25_193602_create_clubs_table', 1),
(26, '2025_04_25_193621_create_organizations_table', 1),
(27, '2025_04_25_221558_create_supporters_table', 1),
(28, '2025_05_05_023231_create_attendances_table', 1),
(29, '2025_05_09_110943_create_permission_tables', 1),
(30, '2025_05_09_111257_create_admins_table', 1),
(31, '2025_06_19_062432_create_payments_table', 1),
(32, '2025_07_11_131722_create_instructors_table', 1),
(33, '2025_07_21_090123_create_instructor_students_table', 1),
(34, '2025_07_28_000000_create_certifications_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `default_currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MYR',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `name`, `code`, `logo`, `email`, `phone`, `website`, `country`, `city`, `street`, `postal_code`, `status`, `is_verified`, `default_currency`, `created_at`, `updated_at`) VALUES
(1, 'Malaysian Taekwon-Do Federation', 'ORG001', NULL, 'info@mtf.org.my', '+603-1234-5678', 'https://www.mtf.org.my', 'Malaysia', 'Kuala Lumpur', '123 Jalan Ampang', '50450', 1, 0, 'USD', '2025-08-21 07:34:37', '2025-08-21 08:32:41'),
(2, 'Selangor Taekwon-Do Association', 'ORG002', NULL, 'info@selangortkd.org.my', '+603-9876-5432', 'https://www.selangortkd.org.my', 'Malaysia', 'Shah Alam', '456 Jalan Sultan', '40000', 1, 0, 'MYR', '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(3, 'Penang Taekwon-Do Federation', 'ORG003', NULL, 'info@penangtkd.org.my', '+604-1111-2222', 'https://www.penangtkd.org.my', 'Malaysia', 'George Town', '789 Jalan Penang', '10000', 1, 0, 'MYR', '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(4, 'NEGERI SEMBILAN - RMAA', NULL, NULL, 'info@rmaamartialarts.com', '01111919484', 'rmaamartialarts.com', 'Malaysia', 'Seremban', 'Negeri Sembilan', '70300', 1, 0, 'MYR', '2025-09-19 01:52:15', '2025-09-19 01:52:15'),
(5, 'WB PUTRAJAYA -NUR AMIZA', NULL, NULL, 'putrajaya@mtf.com', '0176503849', 'www.mtf.com', 'Malaysia', 'Putrajaya', 'Putrajaya', '62000', 1, 0, 'MYR', '2025-09-19 01:57:30', '2025-09-19 01:57:30'),
(6, 'KELANTAN MTF', NULL, NULL, 'kelantan@mtf.com', '0102913680', NULL, 'Malaysia', 'Seremban', '34-1, Jalan S2 B16,', '70300', 1, 0, 'MYR', '2025-11-03 09:03:34', '2025-11-03 09:03:34');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `month` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('unpaid','paid') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pay_at` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `currency_code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MYR',
  `bank_information` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `student_id`, `month`, `amount`, `method`, `status`, `transaction_id`, `pay_at`, `due_date`, `notes`, `currency_code`, `bank_information`, `created_at`, `updated_at`) VALUES
(7, 9, '2025-01', 50.00, 'cash', 'unpaid', NULL, NULL, '2025-01-31', NULL, 'MYR', NULL, '2025-11-17 05:24:52', '2025-11-17 05:24:52'),
(8, 10, '2025-01', 600.00, 'cash', 'unpaid', NULL, NULL, '2025-01-31', NULL, 'MYR', NULL, '2025-11-20 22:37:37', '2025-11-20 22:37:37'),
(9, 3, '2025-11', 500.00, 'cash', 'unpaid', NULL, NULL, '2025-11-30', NULL, 'MYR', NULL, '2025-11-27 01:44:32', '2025-11-27 01:44:32'),
(10, 15, '2025-11', 60.00, 'cash', 'unpaid', NULL, '2025-11-27', '2025-11-30', NULL, 'MYR', '[{\"id\":11,\"bank_name\":\"CIMB\",\"account_name\":\"MYHIGHST BUSINESS SERVICES\",\"account_number\":\"8004487846\",\"iban\":null,\"swift_code\":null,\"branch\":\"PD\",\"currency\":\"MYR\",\"userable_type\":\"App\\\\Models\\\\User\",\"userable_id\":7,\"created_at\":\"2025-09-30T20:41:23.000000Z\",\"updated_at\":\"2025-09-30T20:41:23.000000Z\"}]', '2025-11-27 01:52:19', '2025-11-27 01:52:56');

-- --------------------------------------------------------

--
-- Table structure for table `payment_attachments`
--

CREATE TABLE `payment_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `payment_id` bigint(20) UNSIGNED NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `planable_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `planable_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_amount` decimal(10,2) NOT NULL,
  `currency_code` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MYR',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `planable_type`, `planable_id`, `name`, `base_amount`, `currency_code`, `is_active`, `description`, `created_at`, `updated_at`) VALUES
(4, 'App\\Models\\Club', 1, 'Plan 1', 100.00, 'MYR', 1, 'Lorem Ipsum', '2025-11-17 05:16:22', '2025-11-17 05:23:58'),
(5, 'App\\Models\\Club', 3, 'Essential', 500.00, 'MYR', 1, 'Essential', '2025-11-17 17:46:40', '2025-11-17 17:46:40'),
(6, 'App\\Models\\Club', 3, 'Advance', 700.00, 'MYR', 1, 'Advance', '2025-11-17 17:46:56', '2025-11-17 17:46:56'),
(7, 'App\\Models\\Club', 7, 'test1', 600.00, 'MYR', 1, NULL, '2025-11-19 02:42:56', '2025-11-19 02:42:56'),
(8, 'App\\Models\\Club', 8, 'Princess X', 60.00, 'MYR', 1, NULL, '2025-11-27 01:34:48', '2025-11-27 01:34:48'),
(9, 'App\\Models\\Club', 3, 'Princess x', 60.00, 'MYR', 1, 'Payment month Nov 2025', '2025-11-27 01:43:57', '2025-11-27 01:43:57');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rater_id` bigint(20) UNSIGNED NOT NULL,
  `rater_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rated_id` bigint(20) UNSIGNED NOT NULL,
  `rated_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `rater_id`, `rater_type`, `rated_id`, `rated_type`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 'App\\Models\\Student', 1, 'App\\Models\\Instructor', 5, 'Excellent teaching methods and very patient with beginners.', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(2, 2, 'App\\Models\\Student', 2, 'App\\Models\\Instructor', 4, 'Great instructor, helped me improve my techniques significantly.', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(3, 3, 'App\\Models\\Student', 3, 'App\\Models\\Instructor', 5, 'Outstanding mentor, very knowledgeable and supportive.', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(4, 1, 'App\\Models\\Instructor', 1, 'App\\Models\\Student', 4, 'Dedicated student with good progress in training.', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(5, 2, 'App\\Models\\Instructor', 2, 'App\\Models\\Student', 5, 'Excellent student with strong commitment to learning.', '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(6, 3, 'App\\Models\\Instructor', 3, 'App\\Models\\Student', 5, 'Exceptional student, ready for black belt promotion.', '2025-08-21 07:34:41', '2025-08-21 07:34:41');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('D9jqCXolNGS9dngbamG01AuwGjOkAR1CIqr1JS8C', NULL, '205.169.39.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.132 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFlCcWVBaGpUTjVqdHhHTHNJWUNDeVN4N0k2NFpHaHZDTkFWcXYyQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly90YWVrd29uZG8ua2Jzb2x1dGlvbnMuYWdlbmN5L2xvZ2luIjtzOjU6InJvdXRlIjtzOjU6ImxvZ2luIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764223825),
('X83Q3OexA4HwoTsfuBelOUGjt1ufZiHCNrPoUjVx', 7, '118.100.95.42', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3BFSDhqdnc3eU1BSWE5dnNXTXlzMXNpcTd3eVpEbHZaOGJvSnZKMyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6NztzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1764228358),
('zfnWirCuZDadzmJH3CISV0Yzo4FpPND4BL62W2T8', NULL, '37.131.106.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmp3Zkp4SFdUMGRSeE0wa0xiVGFDakgzZ1pWcHFoZzFwdjlGN2d5eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDI6Imh0dHBzOi8vdGFla3dvbmRvLmtic29sdXRpb25zLmFnZW5jeS9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764300384);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `organization_id` bigint(20) UNSIGNED NOT NULL,
  `uid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `dod` date DEFAULT NULL,
  `grade` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_passport` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identification_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `club_id`, `organization_id`, `uid`, `code`, `name`, `surname`, `nationality`, `dob`, `dod`, `grade`, `gender`, `id_passport`, `profile_image`, `identification_document`, `email`, `phone`, `website`, `city`, `postal_code`, `street`, `country`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'STU001', 'S001', 'Ahmad', 'Hassan', 'Malaysian', '2005-03-15', NULL, '10th Gup - White', 'male', 'A12345678', 'students/x0mY8p7ZPd4pUm8yQbfEuispJOrYDq7S5lH1dIDD.jpg', NULL, 'ahmad.hassan@email.com', '+6012-345-6789', NULL, 'Kuala Lumpur', '55100', '123 Jalan Bukit Bintang', 'MYS', 1, '2025-08-21 07:34:37', '2025-09-04 01:29:42'),
(2, 2, 2, 'STU002', 'S002', 'Siti', 'Aminah', 'MYS', '2025-09-30', NULL, '10th Gup - White', 'female', 'B87654321', 'students/aqQ1xwd1L342LyzwpwtLH1TdsxSA5dxsUScXexUC.jpg', NULL, 'siti.aminah@email.com', '+6012-987-6543', NULL, 'Shah Alam', '40100', '456 Jalan Subang', 'MYS', 1, '2025-08-21 07:34:37', '2025-09-30 11:45:56'),
(3, 3, 3, 'STU003', 'S003', 'Raj', 'Kumar', 'PAK', '1992-10-13', NULL, '9th Gup - White w/ Yellow Tag', 'male', 'C11223344', 'students/QaMBqgy6f38Ns8bV4eudA7RfzvpKRnvP5ixLuGMD.jpg', NULL, 'raj.kumar@email.com', '+6012-555-1234', NULL, 'George Town', '10250', '789 Jalan Gurney', 'Malaysia', 1, '2025-08-21 07:34:37', '2025-10-13 06:29:30'),
(4, 3, 3, 'STD-20250822-HCS4AK', 'STD-20250822-MU6K23', 'Esse vitae voluptas', 'Quia numquam esse om', 'AND', '1983-10-19', '1970-05-09', '4th Gup - Blue', 'female', '', 'students/38SSsnzi30YuIjnJGQXiTtw8D9A1XOxjBrIesdnJ.png', 'students/EqNv17DhXx25SVb60MkjD8seYWTiUxENfiikat5M.pdf', 'nutobawy@mailinator.com', '+14214269834', 'Consequuntur maiores', 'Error cupiditate quo', 'Omnis maiores accusa', 'Ut et tempor sapient', '', 0, '2025-08-22 08:26:43', '2025-08-22 08:26:43'),
(5, 3, 3, 'STD-20250825-XUCLJH', 'STD-20250825-ASYELT', 'Princess', 'Raj', 'MYS', '1977-10-13', NULL, '3rd Gup - Blue w/ Red Tag', 'female', '', 'students/TTh0EG81mHNJAv0teGTrZDFxXgn3Lqjf5mqwGgb9.jpg', NULL, 'rkb@myhighst.com.my', '+601111919484', NULL, 'BANDAR TELOK KEMANG,', '71050', 'LOTS 1944 JALAN PANTAI 3, TANJUNG TANAH MERAH, BANDAR TELOK KEMANG, DAERAH PORT DICKSON, NEGERI SEMBILAN DARUL KHUSUS', 'MYS', 1, '2025-08-25 09:21:45', '2025-10-13 06:26:01'),
(6, 2, 2, 'STD-20250908-QLSLND', 'STD-20250908-WQ8FTY', 'John', 'Patto', 'MYS', '1997-09-24', NULL, '10th Gup - White', 'male', '', 'students/CAgsDszjTDMn6fhisrmvWwfPMf50t0MckwrZq8BH.jpg', NULL, 'ctheseira@yahoo.com', '+6024232342342', NULL, 'Siput', '12312', 'Lot 5, Jln Galloway 9S, Seksyen 20, 31875 Sungai Siput, Perak Darul Ridzuan', 'MYS', 1, '2025-09-08 11:37:34', '2025-09-08 11:37:34'),
(7, 5, 2, 'STD-20250909-U9AG8K', 'STD-20250909-JTVDOR', 'Princess Ximena', 'Raj', 'MYS', '2013-05-17', NULL, '1st Dan - Black Belt', 'female', '', 'students/rqwvrT33Hs5VDhypEY1RU99gK2IIMOYocR3myqCS.jpg', NULL, 'princess1@hotmail.com', '+601111919484', NULL, 'BANDAR TELOK KEMANG,', '71050', 'LOTS 1944 JALAN PANTAI 3, TANJUNG TANAH MERAH, BANDAR TELOK KEMANG, DAERAH PORT DICKSON, NEGERI SEMBILAN DARUL KHUSUS', 'MYS', 1, '2025-09-09 12:57:20', '2025-09-09 12:57:20'),
(8, 6, 4, 'STD-20250919-KT1T00', 'STD-20250919-XNVY8F', 'Devannan', 'Manimaran', 'MYS', '2009-10-13', NULL, '1st Dan - Black Belt', 'male', '', 'students/XB16a6aEbhWc1G9sVpTGl7UinOfS9q0th0QS0qQV.jpg', NULL, 'devannan@mtf.com', '+60138332345', NULL, 'Seremban', '70300', '34-1, Jalan S2 B16,', 'MYS', 1, '2025-09-19 02:13:22', '2025-10-13 06:24:26'),
(9, 1, 1, 'STD-20251020-LV2VDG', 'STD-20251020-QUZKPY', 'googleabctest', 'testing', 'MYS', '1997-10-16', NULL, '9th Gup - White w/ Yellow Tag', 'male', '', 'students/TgPPeJVVQGSrLkTMOFTS3oVrBU2XmxerPM0b7PLR.jpg', NULL, 'googleabctest@gmail.com', '+60234242424', NULL, 'test', '2342424', 'sdfdsf', 'MYS', 1, '2025-10-20 07:44:00', '2025-10-20 07:44:00'),
(10, 7, 1, 'STD-20251020-P2XA3I', 'STD-20251020-EIGGFB', 'yahooclubStudent01', 'Student01', 'MYS', '1989-10-20', NULL, '10th Gup - White', 'male', '', 'students/YPWH4BmaSZTmIv8lx7f6V9JDY7z03QARps1wDGZD.png', NULL, 'yahooclubstudent01@yahoo.com', '+602423424324', NULL, 'sdfsfsdf', '23424234', 'dcsdfdsf', '', 1, '2025-10-20 08:08:48', '2025-10-20 08:08:48'),
(11, 8, 3, 'STD-20251103-DIEDWN', 'STD-20251103-66P5RA', 'Princess X', 'Raj', 'MYS', '2013-12-05', NULL, '10th Gup - White', 'female', '', NULL, NULL, 'princess1@hotmail.com', '+60102345400', NULL, 'Seremban', '71950', '560 ,BBS 3/25 Hijayu 3, Hijayu 3A ,Bandar Sri Sendayan', 'MYS', 1, '2025-11-03 08:54:31', '2025-11-03 08:54:31'),
(12, 8, 3, 'STD-20251103-4ZA0JV', 'STD-20251103-N8VJQ1', 'Princess X', 'Raj', 'MYS', '2013-12-05', NULL, '10th Gup - White', 'female', '', NULL, NULL, 'princess1@hotmail.com', '+60102345400', NULL, 'Seremban', '71950', '560 ,BBS 3/25 Hijayu 3, Hijayu 3A ,Bandar Sri Sendayan', 'MYS', 1, '2025-11-03 08:55:24', '2025-11-03 08:55:24'),
(13, 8, 3, 'STD-20251103-25EJDV', 'STD-20251103-CUEQCM', 'Princess X', 'Raj', 'MYS', '2013-12-05', NULL, '10th Gup - White', 'female', '', 'students/xkweS7vBS0NVR54yxrxCDpvJFhQN4P8cTYwOTDIK.jpg', NULL, 'princess2@hotmail.com', '+60102345400', NULL, 'Seremban', '71950', '560 ,BBS 3/25 Hijayu 3, Hijayu 3A ,Bandar Sri Sendayan', 'MYS', 1, '2025-11-03 08:57:12', '2025-11-03 08:57:12'),
(14, 9, 6, 'STD-20251103-LDBGN3', 'STD-20251103-BEZLZY', 'Mahmood', 'Alam', 'PAK', '2000-12-22', '0024-02-22', '9th Gup - White w/ Yellow Tag', 'male', '', NULL, NULL, 'mahmood@mtf.com', '+60122526475', NULL, 'PORT DICKSON', '71000', 'LOT 991/37 TOWN BATU 1 JALAN PANTAI ,HAPPY GARDEN', 'MYS', 1, '2025-11-03 09:11:01', '2025-11-04 01:13:06'),
(15, 3, 3, 'STD-20251127-2K8RMO', 'STD-20251127-LU4VQ9', 'googlestest', 'RAJU', 'MYS', '2015-10-27', NULL, '10th Gup - White', 'male', '', NULL, NULL, 'googlestesty@googlestest.com', '+602343243242', NULL, 'Seremban', '70400', '146, Taman Bukit Ampangan', 'MYS', 1, '2025-11-27 01:48:42', '2025-11-27 01:48:42');

-- --------------------------------------------------------

--
-- Table structure for table `student_fee_plans`
--

CREATE TABLE `student_fee_plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `custom_amount` decimal(10,2) DEFAULT NULL,
  `currency_code` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interval` enum('monthly','quarterly','semester','yearly','custom') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `interval_count` int(10) UNSIGNED DEFAULT NULL,
  `discount_type` enum('percent','fixed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `effective_from` date DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `next_period_start` date DEFAULT NULL,
  `next_due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_fee_plans`
--

INSERT INTO `student_fee_plans` (`id`, `student_id`, `plan_id`, `custom_amount`, `currency_code`, `interval`, `interval_count`, `discount_type`, `discount_value`, `effective_from`, `is_active`, `notes`, `next_period_start`, `next_due_date`, `created_at`, `updated_at`) VALUES
(4, 9, 4, NULL, 'MYR', 'monthly', NULL, 'percent', 50.00, NULL, 1, NULL, NULL, NULL, '2025-11-17 05:24:31', '2025-11-17 05:24:31'),
(5, 3, 5, NULL, 'MYR', 'yearly', NULL, NULL, 0.00, '2025-11-18', 1, NULL, NULL, NULL, '2025-11-17 17:49:50', '2025-11-17 17:49:50'),
(6, 10, 7, NULL, 'MYR', 'yearly', NULL, NULL, 0.00, '2025-11-19', 1, NULL, NULL, NULL, '2025-11-19 02:43:56', '2025-11-19 02:43:56'),
(7, 13, 8, NULL, 'MYR', 'monthly', NULL, NULL, 0.00, NULL, 1, NULL, NULL, NULL, '2025-11-27 01:35:59', '2025-11-27 01:35:59'),
(8, 5, 9, NULL, 'MYR', 'monthly', NULL, NULL, 0.00, NULL, 1, NULL, NULL, NULL, '2025-11-27 01:45:19', '2025-11-27 01:45:19'),
(9, 15, 9, NULL, NULL, 'monthly', NULL, NULL, 0.00, NULL, 1, NULL, NULL, NULL, '2025-11-27 01:48:43', '2025-11-27 01:48:43');

-- --------------------------------------------------------

--
-- Table structure for table `supporters`
--

CREATE TABLE `supporters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `club_id` bigint(20) UNSIGNED NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','organization','club','student','guardian','instructor') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'student',
  `userable_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userable_id` bigint(20) UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `email_verified_at`, `role`, `userable_type`, `userable_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@tkd.com', '$2y$12$lT2kqqEwJLQ5c0Ss4UJOY.l1fn/brKC192xzwFFgOXYNaU3Cb1dTC', NULL, 'admin', NULL, NULL, NULL, '2025-08-21 07:34:37', '2025-08-21 07:34:37'),
(2, 'Malaysian Taekwon-Do Federation', 'info@mtf.org.my', '$2y$12$.LLQ1ipSa3C478t9gmIEU.U/Gms4x5jLI6GqUJ/vLM.h3oPnlnRsy', NULL, 'organization', 'App\\Models\\Organization', 1, NULL, '2025-08-21 07:34:38', '2025-11-02 23:10:03'),
(3, 'Selangor Taekwon-Do Association', 'info@selangortkd.org.my', '$2y$12$.quCxordQ/3kEMUDLn344..cLZ0FEUN5HmId6Y2ZkLFTrZsXPsu2S', NULL, 'organization', 'App\\Models\\Organization', 2, NULL, '2025-08-21 07:34:38', '2025-09-08 11:11:13'),
(4, 'Penang Taekwon-Do Federation Admin', 'org.penangtaekwon-dofederation@tkd.com', '$2y$12$YrKs.7jCWVmM4.OnQNbjWuA3bbkeDZvdJhmLjhZvk7WEudwleAqyG', NULL, 'organization', 'App\\Models\\Organization', 3, NULL, '2025-08-21 07:34:38', '2025-08-21 07:34:38'),
(5, 'KL Taekwon-Do Center Manager', 'club.kltaekwon-docenter@tkd.com', '$2y$12$V3J.R3WK/q75pjyWNLXJ8ejruprgDjbfAHFmLtIq40jJpYtRLtfYa', NULL, 'club', 'App\\Models\\Club', 1, NULL, '2025-08-21 07:34:38', '2025-08-21 07:34:38'),
(6, 'Shah Alam Martial Arts Club Manager', 'club.shahalammartialartsclub@tkd.com', '$2y$12$NyTbskf17OYYLXYCfOMbSeI0D6Zzg4UqY8eDaJ5MTtqt6cxwOGAeO', NULL, 'club', 'App\\Models\\Club', 2, NULL, '2025-08-21 07:34:39', '2025-08-21 07:34:39'),
(7, 'Penang Combat Academy Manager', 'club.penangcombatacademy@tkd.com', '$2y$12$hqeYWlS6hrcUBd7nVx1w3uWALvKlb6.mqv8ivKtWokm5z7f8ex3fG', NULL, 'club', 'App\\Models\\Club', 3, NULL, '2025-08-21 07:34:39', '2025-08-21 07:34:39'),
(8, 'Ahmad Hassan', 'student1@tkd.com', '$2y$12$usYn.irAym/0o4MS0eIDFe8hB3MZEDtnYVOCWIq6UnYeLi174en5a', NULL, 'student', 'App\\Models\\Student', 1, NULL, '2025-08-21 07:34:39', '2025-08-21 07:34:39'),
(9, 'Siti Aminah', 'student2@tkd.com', '$2y$12$3kfLhDOB5OYDe.VZbXvdKeQs4HcgQaSJ.3Oh7Om/6kAR7yOhiwy4u', NULL, 'student', 'App\\Models\\Student', 2, NULL, '2025-08-21 07:34:40', '2025-08-21 07:34:40'),
(10, 'Raj Kumar', 'student3@tkd.com', '$2y$12$9UDRsmoa..Na/UIFefdzLOdX8E5n07V5szuZvfbcOq.eZ1i82HPMa', NULL, 'student', 'App\\Models\\Student', 3, NULL, '2025-08-21 07:34:40', '2025-08-21 07:34:40'),
(11, 'Master Lim', 'instructor1@tkd.com', '$2y$12$DCW0GE8w5f8bgdFcdvildenSAi5foFLWYfRmUUaIs3WD.wmJJnkPe', NULL, 'instructor', 'App\\Models\\Instructor', 1, NULL, '2025-08-21 07:34:40', '2025-08-21 07:34:40'),
(12, 'Sensei Wong', 'instructor2@tkd.com', '$2y$12$xU.VdTc1ElGZNs3VXLUHse/5cicxgykuBLb2kDH..6Foe2XfJ13HW', NULL, 'instructor', 'App\\Models\\Instructor', 2, NULL, '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(13, 'Coach Tan', 'instructor3@tkd.com', '$2y$12$ZZo926j8OLLSXG1oJ98kuOIxRuJzNzLqs6ZGUqOEgi.2n6Pb57292', NULL, 'instructor', 'App\\Models\\Instructor', 3, NULL, '2025-08-21 07:34:41', '2025-08-21 07:34:41'),
(14, 'Esse vitae voluptas Quia numquam esse om', 'nutobawy@mailinator.com', '$2y$12$oQ0G767PYRQO6/C1Z00qMOdCNLujH.maSlcwuyBtep4HoS8DmaZ6G', NULL, 'student', 'App\\Models\\Student', 4, NULL, '2025-08-22 08:26:44', '2025-10-15 05:02:59'),
(15, 'Perak TKD', 'perak@hotmail.com', '$2y$12$69rNsOLz56Zh9PbDJLbJeuoiJLg1lOANJxN98vzPP.KLg6MCfgG7W', NULL, 'club', 'App\\Models\\Club', 4, NULL, '2025-08-25 09:14:42', '2025-08-25 09:14:42'),
(16, 'Princess Raj', 'rkb@myhighst.com.my', '$2y$12$xdz0mcGZq/fV7K4mRIdZkuPr9LHTOzBD2N6Uik.OAW81yMwjoCZZi', NULL, 'student', 'App\\Models\\Student', 5, NULL, '2025-08-25 09:21:45', '2025-08-25 09:21:45'),
(17, 'Ahmad Hassan', 'ahmad.hassan@email.com', '$2y$12$YxCHfnMbE.r95zrwqjvkmerA7To9J/uNfozAgSvyw276mBszQT7zq', NULL, 'student', NULL, NULL, NULL, '2025-09-04 01:29:43', '2025-09-04 01:29:43'),
(18, 'Jane Jayawardene', 'xyasin@yahoo.com', '$2y$12$xlVwkA6FFPG5RYmT1OEvA.3R0KM3fPcqXYgqY71vijfJ5tG/TCA8u', NULL, 'instructor', 'App\\Models\\Instructor', 4, NULL, '2025-09-08 11:27:58', '2025-09-08 11:27:58'),
(19, 'Siti Aminah', 'siti.aminah@email.com', '$2y$12$fdHZdlbS4HRJVn9TvcfB5OyrS51O94fYUxJfpfb5FGJmJzo2S1nfK', NULL, 'student', NULL, NULL, NULL, '2025-09-08 11:31:43', '2025-09-30 11:45:56'),
(20, 'John Patto', 'ctheseira@yahoo.com', '$2y$12$hNyH7xYLRw5InrBncEMuVeVPFkQ20HL6LiAxncG0jhwu6UUs8SrDa', NULL, 'student', 'App\\Models\\Student', 6, NULL, '2025-09-08 11:37:35', '2025-11-03 08:25:07'),
(21, 'Revolution Martial Arts Academy', 'benjamin@hotmail.com', '$2y$12$DDbErW1iVlG5gIjFuoHYM.W7UyOz9Sk5rK9ndkTQfzdeYFgDKeSI6', NULL, 'club', 'App\\Models\\Club', 5, NULL, '2025-09-09 12:49:48', '2025-09-09 12:49:48'),
(22, 'Princess Ximena Raj', 'princess1@hotmail.com', '$2y$12$9RbMJuBn1j1IX70yeL3YEemqrgbQynf57AHGhrmWyO/oxpTfB59vy', NULL, 'student', 'App\\Models\\Student', 7, NULL, '2025-09-09 12:57:20', '2025-09-09 12:57:20'),
(23, 'Master Benjamin', 'rkb1@myhighst.com.my', '$2y$12$ZMT6Zmyy/pyVu2Ef149DEeAYYeD1fOXVphvGNmPlLunThVVnQG4lu', NULL, 'instructor', 'App\\Models\\Instructor', 5, NULL, '2025-09-09 13:04:15', '2025-09-09 13:04:15'),
(24, 'NEGERI SEMBILAN - RMAA', 'info@rmaamartialarts.com', '$2y$12$BKv7//pPJkzo/YpZxBzvnuwRfz2WNFXzW4hI3lQ.PnGe9Z7v52cQe', NULL, 'organization', 'App\\Models\\Organization', 4, NULL, '2025-09-19 01:52:15', '2025-11-03 08:42:26'),
(25, 'WB PUTRAJAYA -NUR AMIZA', 'putrajaya@mtf.com', '$2y$12$21ehF9Mn4fcc1rSP0YNPn.IFw6umg4zSkjGOB6SAaFcy.yIkM0A4q', NULL, 'organization', 'App\\Models\\Organization', 5, NULL, '2025-09-19 01:57:30', '2025-09-19 01:57:30'),
(26, 'BENJAMIN CLUB1', 'benjamin@mtf.com', '$2y$12$4j.MrPor3TNk5xuCCh7t5eJD7GhwXScoJF91C5Y80K29kAFuMiQHW', NULL, 'club', 'App\\Models\\Club', 6, NULL, '2025-09-19 02:04:33', '2025-09-19 02:04:33'),
(27, 'Devannan Manimaran', 'devannan@mtf.com', '$2y$12$DpjbsDNXEopAWLUrooXkTufMjcFs8JNEg.8rHzP7CBiXAlKo0dD5W', NULL, 'student', 'App\\Models\\Student', 8, NULL, '2025-09-19 02:13:22', '2025-09-19 02:13:22'),
(28, 'Desmond', 'desmond@mtf.com', '$2y$12$eNZ28.FFOBa4JyQ.m73o.OtjQvJHW1YKDZaY7J6YrLP27xQtTNmp6', NULL, 'instructor', 'App\\Models\\Instructor', 6, NULL, '2025-09-19 02:16:15', '2025-09-19 02:16:15'),
(29, 'Raj Kumar', 'raj.kumar@email.com', '$2y$12$dV7p6N5XgI/NRs2qtNtTvuvV5w6kqcRaMh00Is8cYVRWHc565jAFK', NULL, 'student', NULL, NULL, NULL, '2025-10-13 06:29:30', '2025-10-13 06:29:30'),
(30, 'googleabctest testing', 'googleabctest@gmail.com', '$2y$12$6sxtYmd59Ztd2zKERg3yxuiA.t5mg66zRMKo1MVi21My/T2vyHsiK', NULL, 'student', 'App\\Models\\Student', 9, NULL, '2025-10-20 07:44:01', '2025-10-20 07:44:01'),
(31, 'yahooclub', 'yahooclub@yahoo.com', '$2y$12$I/0LJRu/M2xM4pRh9cL7seBfFMyLNx0iiv86YuRo6XMXx/Ksxo2uy', NULL, 'club', 'App\\Models\\Club', 7, NULL, '2025-10-20 08:05:10', '2025-10-20 08:05:10'),
(32, 'instructor01', 'yahooclub_instructor01@yahoo.com', '$2y$12$JwbE7T8cBd9ajpLP6Xt6r.RyZ9GZju1wWDhBLRvfeHv5Fl7PhUH0a', NULL, 'instructor', 'App\\Models\\Instructor', 7, NULL, '2025-10-20 08:07:27', '2025-10-20 08:07:27'),
(33, 'yahooclubStudent01 Student01', 'yahooclubStudent01@yahoo.com', '$2y$12$O6OjogLY5k0qI0MswEF7vuiAGMq8cVGcD8j4pRh4N/EAVWrUDQOf2', NULL, 'student', 'App\\Models\\Student', 10, NULL, '2025-10-20 08:08:48', '2025-10-20 08:08:48'),
(34, 'BENJAMIN CLUB TKD', 'rkb003@hotmail.com', '$2y$12$iGLQBNautqL2ojYx3m0JYOi3TwL14A12qhaax9upDTXoOw9hzk4k.', NULL, 'club', 'App\\Models\\Club', 8, NULL, '2025-11-03 08:50:28', '2025-11-27 01:32:57'),
(37, 'Princess X Raj', 'princess2@hotmail.com', '$2y$12$w0PVsoVcbldAmMbmZQi6J.bG5gQ6oiL9MBefaw93o3EtkPgOnKnke', NULL, 'student', 'App\\Models\\Student', 13, NULL, '2025-11-03 08:57:12', '2025-11-03 08:57:12'),
(38, 'KELANTAN MTF', 'kelantan@mtf.com', '$2y$12$vjhXhky2pGsezq23/R///OEh55CQsEMSU5U7TT6bf.M4Vao/jx.h2', NULL, 'organization', 'App\\Models\\Organization', 6, NULL, '2025-11-03 09:03:35', '2025-11-03 09:03:35'),
(39, 'Kamran TKD', 'kamran@mtf.com', '$2y$12$Vevu7rtTTlOwAgQ8HVSy0uMGG/9XZ.Nip6TOIg6ZljT9TCeiyoATW', NULL, 'club', 'App\\Models\\Club', 9, NULL, '2025-11-03 09:06:43', '2025-11-03 09:06:43'),
(40, 'Mahmood Alam', 'mahmood@mtf.com', '$2y$12$e17uDnUWnXDr00vNatI9SeVuw1aGaNDwAc9ZFqq5JGR/hdgGNR5OG', NULL, 'student', 'App\\Models\\Student', 14, NULL, '2025-11-03 09:11:02', '2025-11-03 09:11:02'),
(41, 'Sifu Guna', 'guna@mtf.com', '$2y$12$FCPH0DofLzr6mzUZwLc9ve6vkDwE7xFnEj/34vnTKT7r0t.Nzzpuq', NULL, 'instructor', 'App\\Models\\Instructor', 8, NULL, '2025-11-03 09:13:38', '2025-11-03 09:13:38'),
(42, 'googlestest RAJU', 'googlestesty@googlestest.com', '$2y$12$h31Of0uAyeNI9VOozt2tPOi6akNLn9Woj/pdl9/aZEJsUvwuxFC/e', NULL, 'student', 'App\\Models\\Student', 15, NULL, '2025-11-27 01:48:43', '2025-11-27 01:48:43');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendances_student_id_foreign` (`student_id`);

--
-- Indexes for table `bank_information`
--
ALTER TABLE `bank_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_information_userable_type_userable_id_index` (`userable_type`,`userable_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certifications_student_id_foreign` (`student_id`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `currencies_code_unique` (`code`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_club_id_foreign` (`club_id`),
  ADD KEY `events_organization_id_foreign` (`organization_id`),
  ADD KEY `events_created_by_foreign` (`created_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `instructors_email_unique` (`email`),
  ADD KEY `instructors_organization_id_foreign` (`organization_id`),
  ADD KEY `instructors_club_id_foreign` (`club_id`);

--
-- Indexes for table `instructor_student`
--
ALTER TABLE `instructor_student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `instructor_student_instructor_id_student_id_unique` (`instructor_id`,`student_id`),
  ADD KEY `instructor_student_student_id_foreign` (`student_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location_images`
--
ALTER TABLE `location_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_images_location_id_foreign` (`location_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_student_id_foreign` (`student_id`);

--
-- Indexes for table `payment_attachments`
--
ALTER TABLE `payment_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_attachments_payment_id_foreign` (`payment_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plans_name_planable_unique` (`name`,`planable_type`,`planable_id`),
  ADD KEY `plans_planable_type_planable_id_index` (`planable_type`,`planable_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ratings_rater_id_rater_type_index` (`rater_id`,`rater_type`),
  ADD KEY `ratings_rated_id_rated_type_index` (`rated_id`,`rated_type`),
  ADD KEY `ratings_rater_id_rater_type_rated_id_rated_type_index` (`rater_id`,`rater_type`,`rated_id`,`rated_type`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_uid_unique` (`uid`);

--
-- Indexes for table `student_fee_plans`
--
ALTER TABLE `student_fee_plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_fee_plans_student_id_foreign` (`student_id`),
  ADD KEY `student_fee_plans_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `supporters`
--
ALTER TABLE `supporters`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_userable_type_userable_id_index` (`userable_type`,`userable_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `bank_information`
--
ALTER TABLE `bank_information`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `instructor_student`
--
ALTER TABLE `instructor_student`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `location_images`
--
ALTER TABLE `location_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payment_attachments`
--
ALTER TABLE `payment_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `student_fee_plans`
--
ALTER TABLE `student_fee_plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `supporters`
--
ALTER TABLE `supporters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_club_id_foreign` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `events_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `events_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `instructors`
--
ALTER TABLE `instructors`
  ADD CONSTRAINT `instructors_club_id_foreign` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `instructors_organization_id_foreign` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `instructor_student`
--
ALTER TABLE `instructor_student`
  ADD CONSTRAINT `instructor_student_instructor_id_foreign` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `instructor_student_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `location_images`
--
ALTER TABLE `location_images`
  ADD CONSTRAINT `location_images_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_fee_plans`
--
ALTER TABLE `student_fee_plans`
  ADD CONSTRAINT `student_fee_plans_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `student_fee_plans_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
