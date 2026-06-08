-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: bookhotel
-- ------------------------------------------------------
-- Server version	8.4.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int DEFAULT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nama` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `harga` decimal(12,2) NOT NULL,
  `payment_proof` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_time` datetime DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_bookings_user` (`user_id`),
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (25,1,NULL,'Comfort Triple Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-07','2026-06-08',250000.00,NULL,NULL,NULL,'confirmed','2026-06-06 15:56:56','2026-06-08 12:12:29'),(26,1,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-10',100000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:18:35','2026-06-08 11:49:43'),(27,1,NULL,'Comfort Triple Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-21','2026-06-23',500000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:45:04','2026-06-08 11:49:43'),(28,1,NULL,'Comfort Triple Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-21','2026-06-23',500000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:46:23','2026-06-08 11:49:43'),(29,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:52:34','2026-06-08 11:49:43'),(30,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:52:46','2026-06-08 11:49:43'),(31,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:52:55','2026-06-08 11:49:43'),(32,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:55:30','2026-06-08 11:49:43'),(33,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:55:42','2026-06-08 11:49:43'),(34,1,NULL,'Superior Double Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-30','2026-07-31',6200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 06:57:17','2026-06-08 11:49:43'),(41,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:29:59','2026-06-08 11:49:43'),(42,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:31:19','2026-06-08 11:49:43'),(43,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:40:40','2026-06-08 11:49:43'),(44,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:40:45','2026-06-08 11:49:43'),(45,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:45:59','2026-06-08 11:49:43'),(46,3,NULL,'Standard Single Room','william jonathan','wj10989@gmail.com','081312575752','2026-06-09','2026-06-11',200000.00,NULL,NULL,NULL,'cancelled','2026-06-08 08:46:06','2026-06-08 11:49:43'),(47,1,NULL,'Classic Double Room','wesley jonathan','wesleyici078@gmail.com','943289942','2026-06-09','2026-06-10',150000.00,NULL,NULL,NULL,'cancelled','2026-06-08 09:26:57','2026-06-08 11:49:43'),(48,1,NULL,'Classic Double Room','wesley jonathan','wesleyici078@gmail.com','943289942','2026-06-09','2026-06-10',150000.00,NULL,NULL,NULL,'cancelled','2026-06-08 09:27:01','2026-06-08 11:49:43'),(49,1,NULL,'Classic Double Room','wesley jonathan','wesleyici078@gmail.com','943289942','2026-06-09','2026-06-10',150000.00,NULL,NULL,NULL,'cancelled','2026-06-08 09:28:08','2026-06-08 11:49:43'),(50,1,NULL,'Standard Single Room','wesley jonathan','wesleyici078@gmail.com','342432','2026-06-08','2026-06-09',100000.00,NULL,NULL,NULL,'cancelled','2026-06-08 10:27:20','2026-06-08 11:49:43'),(51,1,NULL,'Standard Single Room','wesley jonathan','wesleyici078@gmail.com','342432','2026-06-08','2026-06-09',100000.00,NULL,NULL,NULL,'cancelled','2026-06-08 10:29:21','2026-06-08 11:49:43'),(52,1,NULL,'Standard Single Room','wesley jonathan','wesleyici078@gmail.com','342432','2026-06-08','2026-06-09',100000.00,NULL,NULL,NULL,'confirmed','2026-06-08 10:29:33','2026-06-08 10:35:49'),(53,1,3,'Standard Single Room','wesley jonathan','wesleyici078@gmail.com','23131231','2026-06-08','2026-06-09',100000.00,NULL,NULL,NULL,'cancelled','2026-06-08 10:52:05','2026-06-08 11:56:57'),(54,1,1,'Classic Double Room','wesley jonathan','wesleyici078@gmail.com','32131231','2026-06-08','2026-06-09',150000.00,NULL,NULL,NULL,'cancelled','2026-06-08 11:07:56','2026-06-08 12:11:21'),(55,1,2,'Comfort Triple Room','wesley jonathan','wesleyici078@gmail.com','321312313','2026-06-08','2026-06-09',250000.00,NULL,NULL,NULL,'cancelled','2026-06-08 11:14:16','2026-06-08 12:25:03'),(56,1,2,'Comfort Triple Room','wesley jonathan','wesleyici078@gmail.com','321312313','2026-06-08','2026-06-09',250000.00,NULL,NULL,NULL,'cancelled','2026-06-08 11:14:26','2026-06-08 12:25:03'),(57,1,2,'Comfort Triple Room','wesley jonathan','wesleyici078@gmail.com','321312313','2026-06-08','2026-06-09',250000.00,NULL,NULL,NULL,'confirmed','2026-06-08 11:14:32','2026-06-08 11:16:55'),(58,1,4,'Superior Double Room','wesley jonathan','wesleyici078@gmail.com','2313123','2026-06-08','2026-06-09',200000.00,NULL,NULL,NULL,'confirmed','2026-06-08 11:20:34','2026-06-08 11:21:16'),(59,5,5,'Mountain View Suite','wesley jonathan','wesleyici078@gmail.com','321321312','2026-06-08','2026-06-09',250000.00,NULL,NULL,NULL,'confirmed','2026-06-08 11:29:27','2026-06-08 11:30:12'),(60,5,1,'Classic Double Room','william','william@gmail.com','3213213','2026-06-08','2026-06-09',150000.00,NULL,NULL,NULL,'completed','2026-06-08 11:58:25','2026-06-08 12:26:41'),(62,6,1,'Classic Double Room','jonathan','wj10989@gmail.com','23131231','2026-06-08','2026-06-09',150000.00,NULL,NULL,NULL,'confirmed','2026-06-08 13:03:46','2026-06-08 13:04:12'),(63,1,2,'Comfort Triple Room','william','wesleyici078@gmail.com','321321321','2026-06-08','2026-06-09',250000.00,NULL,NULL,NULL,'confirmed','2026-06-08 13:12:23','2026-06-08 13:13:02');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `order_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gross_amount` decimal(12,2) NOT NULL,
  `transaction_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transaction_time` datetime DEFAULT NULL,
  `snap_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redirect_url` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `fk_payments_booking` (`booking_id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (14,25,'ORDER-25-1780761416663',250000.00,'pending',NULL,'Bank Transfer','2026-06-06 22:56:57','59df31cb-8d71-4767-8f8a-83413e478205','https://app.midtrans.com/snap/v4/redirection/59df31cb-8d71-4767-8f8a-83413e478205','2026-06-06 15:56:56','2026-06-06 15:56:56'),(15,26,'ORDER-26-1780899515352',100000.00,'pending',NULL,'Bank Transfer','2026-06-08 13:18:35','627d8283-2bf3-4fa6-a308-cc8c78813180','https://app.midtrans.com/snap/v4/redirection/627d8283-2bf3-4fa6-a308-cc8c78813180','2026-06-08 06:18:35','2026-06-08 06:18:35'),(16,27,'MANUAL-27-1780901104354',500000.00,'pending',NULL,'Bank Transfer','2026-06-08 13:45:04',NULL,NULL,'2026-06-08 06:45:04','2026-06-08 06:45:04'),(17,28,'MANUAL-28-1780901183383',500000.00,'pending',NULL,'QRIS','2026-06-08 13:46:23',NULL,NULL,'2026-06-08 06:46:23','2026-06-08 06:46:23'),(18,29,'ORDER-29-1780901554106',6200000.00,'pending',NULL,'Bank Transfer','2026-06-08 13:52:34','8b93aed5-0ec0-44a9-878c-8f04ed2007f6','https://app.midtrans.com/snap/v4/redirection/8b93aed5-0ec0-44a9-878c-8f04ed2007f6','2026-06-08 06:52:34','2026-06-08 06:52:34'),(19,30,'ORDER-30-1780901566124',6200000.00,'pending',NULL,'Bank Transfer','2026-06-08 13:52:46','967d4d7c-26c8-4374-bb58-fde1a00c1e15','https://app.midtrans.com/snap/v4/redirection/967d4d7c-26c8-4374-bb58-fde1a00c1e15','2026-06-08 06:52:46','2026-06-08 06:52:46'),(20,31,'ORDER-31-1780901575106',6200000.00,'pending',NULL,'QRIS','2026-06-08 13:52:55','6c094641-fd7d-4493-ae82-0c6d322ffd1a','https://app.midtrans.com/snap/v4/redirection/6c094641-fd7d-4493-ae82-0c6d322ffd1a','2026-06-08 06:52:55','2026-06-08 06:52:55'),(21,32,'ORDER-32-1780901730699',6200000.00,'pending',NULL,'QRIS','2026-06-08 13:55:31','f1dfc4ee-9234-43f7-8aeb-a0d2767e36d6','https://app.midtrans.com/snap/v4/redirection/f1dfc4ee-9234-43f7-8aeb-a0d2767e36d6','2026-06-08 06:55:30','2026-06-08 06:55:30'),(22,33,'ORDER-33-1780901742623',6200000.00,'pending',NULL,'Bank Transfer BNI','2026-06-08 13:55:43','58607692-2e8d-4c26-964c-95634bfbc2f9','https://app.midtrans.com/snap/v4/redirection/58607692-2e8d-4c26-964c-95634bfbc2f9','2026-06-08 06:55:42','2026-06-08 06:55:42'),(23,34,'ORDER-34-1780901837659',6200000.00,'pending',NULL,'QRIS','2026-06-08 13:57:18','22c420d0-dc40-46e6-b9c4-2d3b93d3e3d7','https://app.midtrans.com/snap/v4/redirection/22c420d0-dc40-46e6-b9c4-2d3b93d3e3d7','2026-06-08 06:57:17','2026-06-08 06:57:17'),(31,41,'ORDER-41-1780907399059',200000.00,'pending',NULL,'Midtrans Snap','2026-06-08 15:29:59','34c37594-9957-4a12-a8fd-c0b327c52d65','https://app.midtrans.com/snap/v4/redirection/34c37594-9957-4a12-a8fd-c0b327c52d65','2026-06-08 08:29:59','2026-06-08 08:29:59'),(32,42,'ORDER-42-1780907479726',200000.00,'pending',NULL,'Midtrans Snap','2026-06-08 15:31:20','dcfe79c8-ff08-4d2c-993c-997379e842ff','https://app.midtrans.com/snap/v4/redirection/dcfe79c8-ff08-4d2c-993c-997379e842ff','2026-06-08 08:31:19','2026-06-08 08:31:19'),(33,43,'ORDER-43-1780908040293',200000.00,'pending',NULL,'Midtrans Snap','2026-06-08 15:40:40','6e8a9721-1f40-48d7-b474-ba389faff6fe','https://app.midtrans.com/snap/v4/redirection/6e8a9721-1f40-48d7-b474-ba389faff6fe','2026-06-08 08:40:40','2026-06-08 08:40:40'),(34,44,'ORDER-44-1780908045394',200000.00,'pending',NULL,'GoPay','2026-06-08 15:40:45','9475e3f0-8dca-442d-90c5-fca60b582c62','https://app.midtrans.com/snap/v4/redirection/9475e3f0-8dca-442d-90c5-fca60b582c62','2026-06-08 08:40:45','2026-06-08 08:40:45'),(35,45,'ORDER-45-1780908359209',200000.00,'pending',NULL,'Bank Transfer','2026-06-08 15:45:59','a8cb0cb2-b3a2-47c9-b24e-98a4de456b4a','https://app.midtrans.com/snap/v4/redirection/a8cb0cb2-b3a2-47c9-b24e-98a4de456b4a','2026-06-08 08:45:59','2026-06-08 08:45:59'),(36,46,'ORDER-46-1780908366498',200000.00,'pending',NULL,'QRIS','2026-06-08 15:46:06','9ca56d64-bc42-4870-b95f-1fa640fb9fc2','https://app.midtrans.com/snap/v4/redirection/9ca56d64-bc42-4870-b95f-1fa640fb9fc2','2026-06-08 08:46:06','2026-06-08 08:46:06'),(37,50,'ORDER-50-1780914440287',100000.00,'pending',NULL,'Midtrans Snap','2026-06-08 17:27:20','ba94ef81-890c-4d57-a047-6c1cb5535cee','https://app.sandbox.midtrans.com/snap/v4/redirection/ba94ef81-890c-4d57-a047-6c1cb5535cee','2026-06-08 10:27:20','2026-06-08 10:27:20'),(38,51,'ORDER-51-1780914561038',100000.00,'pending',NULL,'Bank Transfer','2026-06-08 17:29:21','bfb97fd8-e61c-4c5d-a394-e7b348fc9986','https://app.sandbox.midtrans.com/snap/v4/redirection/bfb97fd8-e61c-4c5d-a394-e7b348fc9986','2026-06-08 10:29:21','2026-06-08 10:29:21'),(39,52,'ORDER-52-1780914573090',100000.00,'pending',NULL,'Credit Card','2026-06-08 17:29:33','4f25e2f9-1f12-4a22-a5bc-a449fd5aa2ec','https://app.sandbox.midtrans.com/snap/v4/redirection/4f25e2f9-1f12-4a22-a5bc-a449fd5aa2ec','2026-06-08 10:29:33','2026-06-08 10:29:33'),(40,53,'ORDER-53-1780915925858',100000.00,'pending',NULL,'Bank Transfer','2026-06-08 17:52:06','9919ad0f-fa07-4847-a50c-d9fa6dd95bf7','https://app.sandbox.midtrans.com/snap/v4/redirection/9919ad0f-fa07-4847-a50c-d9fa6dd95bf7','2026-06-08 10:52:05','2026-06-08 10:52:05'),(41,54,'ORDER-54-1780916876246',150000.00,'pending',NULL,'Bank Transfer','2026-06-08 18:07:56','40b6b5a7-b81b-42e0-9b28-f0099bdb1818','https://app.sandbox.midtrans.com/snap/v4/redirection/40b6b5a7-b81b-42e0-9b28-f0099bdb1818','2026-06-08 11:07:56','2026-06-08 11:07:56'),(42,55,'ORDER-55-1780917256330',250000.00,'pending',NULL,'Bank Transfer','2026-06-08 18:14:16','bd966e93-e410-4ed9-a620-c91e1a248908','https://app.sandbox.midtrans.com/snap/v4/redirection/bd966e93-e410-4ed9-a620-c91e1a248908','2026-06-08 11:14:16','2026-06-08 11:14:16'),(43,56,'ORDER-56-1780917266862',250000.00,'pending',NULL,'Bank Transfer','2026-06-08 18:14:27','727e9ffe-b8ef-40e4-9174-32cec414bc38','https://app.sandbox.midtrans.com/snap/v4/redirection/727e9ffe-b8ef-40e4-9174-32cec414bc38','2026-06-08 11:14:26','2026-06-08 11:14:26'),(44,57,'ORDER-57-1780917566007',250000.00,'pending',NULL,'QRIS','2026-06-08 18:14:33','7963d27e-2d25-499c-8b40-403165ea8bb2','https://app.sandbox.midtrans.com/snap/v4/redirection/7963d27e-2d25-499c-8b40-403165ea8bb2','2026-06-08 11:14:32','2026-06-08 11:19:26'),(45,58,'ORDER-58-1780917634029',200000.00,'pending',NULL,'Midtrans Snap','2026-06-08 18:20:34','d75c7aa5-9787-45c1-83de-ffa529fc2209','https://app.sandbox.midtrans.com/snap/v4/redirection/d75c7aa5-9787-45c1-83de-ffa529fc2209','2026-06-08 11:20:34','2026-06-08 11:20:34'),(46,59,'ORDER-59-1780918167241',250000.00,'pending',NULL,'Midtrans Snap','2026-06-08 18:29:27','5319d7db-122a-446b-a981-a292ba5b414c','https://app.sandbox.midtrans.com/snap/v4/redirection/5319d7db-122a-446b-a981-a292ba5b414c','2026-06-08 11:29:27','2026-06-08 11:29:27'),(47,60,'ORDER-60-1780919905539',150000.00,'pending',NULL,'Midtrans Snap','2026-06-08 18:58:26','fb35aeca-a644-4bda-bcdf-d6321d61509f','https://app.sandbox.midtrans.com/snap/v4/redirection/fb35aeca-a644-4bda-bcdf-d6321d61509f','2026-06-08 11:58:25','2026-06-08 11:58:25'),(49,62,'ORDER-62-1780923831459',150000.00,'pending',NULL,'Midtrans Snap','2026-06-08 20:03:47','c8947c96-d3e8-4a8e-af6d-d23af9f476f5','https://app.sandbox.midtrans.com/snap/v4/redirection/c8947c96-d3e8-4a8e-af6d-d23af9f476f5','2026-06-08 13:03:47','2026-06-08 13:03:51'),(50,63,'ORDER-63-1780924343112',250000.00,'pending',NULL,'Midtrans Snap','2026-06-08 20:12:23','9502c77b-ca53-48cd-9037-734e86511219','https://app.sandbox.midtrans.com/snap/v4/redirection/9502c77b-ca53-48cd-9037-734e86511219','2026-06-08 13:12:23','2026-06-08 13:12:23');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `booking_id` int NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `fk_reviews_room` (`room_id`),
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,1,60,5,'kamar yg baik\n','2026-06-08 12:27:09','2026-06-08 12:27:09');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `capacity` int NOT NULL DEFAULT '1',
  `size` varchar(50) DEFAULT NULL,
  `facility` varchar(100) DEFAULT NULL,
  `description` text,
  `amenities` text,
  `image_url` varchar(512) DEFAULT NULL,
  `image_url_2` varchar(512) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `total_units` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Classic Double Room',150000.00,2,'30 M','beach','Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.','Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg','2026-06-04 13:47:41','2026-06-04 13:47:41',1,1),(2,'Comfort Triple Room',250000.00,3,'40 M','beach','Let yourself fully relax in our luxurious favorable accommodations with lots of facilities and high-level service.','Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room-920x650.jpg','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/comfort-triple-room2-920x650.jpg','2026-06-04 13:47:41','2026-06-08 11:27:58',1,3),(3,'Standard Single Room',100000.00,1,'25 M','Swiming Pool','Standard Single room is available with either double or single beds. Designed in an open-concept living area.','Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room2-1536x1094.jpg','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg','2026-06-04 13:47:41','2026-06-04 13:47:41',1,1),(4,'Superior Double Room',200000.00,2,'40 M','Seaside','Your perfect choice for staying in a big city, where you can come and fully relax after an eventful day.','Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room2-1536x1094.jpg','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/superior-double-room-920x650.jpg','2026-06-04 13:47:41','2026-06-04 13:47:41',1,1),(5,'Mountain View Suite',250000.00,4,'35 M','beach','Let yourself fully relax in our luxurious favorable accommodations with lots of facilities.','Bathroom essentials, Bedroom comforts, Free parking, Hair dryer, Heating, Terrace, Wi-Fi','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/classic-double-room-920x650.jpg','https://themes.getmotopress.com/albatross/wp-content/uploads/sites/37/2020/11/standard-single-room-920x650.jpg','2026-06-04 13:47:41','2026-06-04 13:47:41',1,1),(6,'family room',27000.00,4,'30m','-','kamar ini percobaan','-','https://hotelmu.id/gambar/blog/blog-tipe-kamar-hotel-yang-wajib-diketahui-47-l.jpg','https://hotelmu.id/gambar/blog/blog-tipe-kamar-hotel-yang-wajib-diketahui-47-l.jpg','2026-06-04 16:21:15','2026-06-04 16:21:28',0,1);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ici','wesley@gmail.com','$2b$10$tBWTq8Qt4vjd0qmDhjAJd.odl31DXSvfwZ4OB3hcvxuKtNY8zXdHO','user','2026-05-22 01:52:51','2026-05-22 01:52:51'),(3,'admin','admin@gmail.com','$2b$10$nD8pfYCtzoZRs2iUbA7yCe9RRkDeK2Z0jstxjg3e6e23R7qgTCURi','admin','2026-05-29 01:56:17','2026-05-29 01:56:29'),(5,'william','william@gmail.com','$2b$10$lQO9wSe3XBjRwXOqcWJHzeVGhAc2sBxupkeG1ezVjfopPVJlDalW2','user','2026-06-08 11:29:04','2026-06-08 11:29:04'),(6,'jonathan','wj10989@gmail.com','$2b$10$GCzOkEeV/Zl2xVnnb5Ahvu65htiDYC0TYCIcm0K4SwGCxeQBRWib.','user','2026-06-08 12:51:29','2026-06-08 12:51:29');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `diskon` int NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_akhir` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `max_uses` int DEFAULT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 20:48:20
