-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: wine_production
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `ai_model`
--

DROP TABLE IF EXISTS `ai_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_model` (
  `model_id` int NOT NULL,
  `version` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerts` (
  `alert_id` int NOT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `engineer_id` int DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `product_id` (`product_id`),
  KEY `engineer_id` (`engineer_id`),
  CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `alerts_ibfk_2` FOREIGN KEY (`engineer_id`) REFERENCES `engineer` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditlog` (
  `log_id` int NOT NULL,
  `time_log` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(50) DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `engineer_id` int DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  KEY `warehouse_id` (`warehouse_id`),
  KEY `engineer_id` (`engineer_id`),
  CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`),
  CONSTRAINT `auditlog_ibfk_2` FOREIGN KEY (`engineer_id`) REFERENCES `engineer` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batches` (
  `batch_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `producted_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `line_id` int DEFAULT NULL,
  PRIMARY KEY (`batch_id`),
  KEY `line_id` (`line_id`),
  CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`line_id`) REFERENCES `line` (`line_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `engineer`
--

DROP TABLE IF EXISTS `engineer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `engineer` (
  `user_id` int NOT NULL,
  `expertise` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `is_predicted`
--

DROP TABLE IF EXISTS `is_predicted`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `is_predicted` (
  `time_predict` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quality_score` float DEFAULT NULL,
  `confidence` varchar(50) DEFAULT NULL,
  `quality_category` varchar(50) DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  `AI_model` int DEFAULT NULL,
  KEY `product_id` (`product_id`),
  KEY `AI_model` (`AI_model`),
  CONSTRAINT `is_predicted_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `is_predicted_ibfk_2` FOREIGN KEY (`AI_model`) REFERENCES `ai_model` (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `line`
--

DROP TABLE IF EXISTS `line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `line` (
  `line_id` int NOT NULL,
  `active_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `warehouse_id` int DEFAULT NULL,
  PRIMARY KEY (`line_id`),
  KEY `warehouse_id` (`warehouse_id`),
  CONSTRAINT `line_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `measure`
--

DROP TABLE IF EXISTS `measure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `measure` (
  `product_id` varchar(50) DEFAULT NULL,
  `sensor_id` int DEFAULT NULL,
  `value` float DEFAULT NULL,
  KEY `product_id` (`product_id`),
  KEY `sensor_id` (`sensor_id`),
  CONSTRAINT `measure_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `measure_ibfk_2` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`sensor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `monitor`
--

DROP TABLE IF EXISTS `monitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitor` (
  `user_id` int NOT NULL,
  `department_leading` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` varchar(50) NOT NULL,
  `density` float DEFAULT NULL,
  `chlorides` float DEFAULT NULL,
  `alcohol` float DEFAULT NULL,
  `sulphates` float DEFAULT NULL,
  `pH` float DEFAULT NULL,
  `fixed_acidity` float DEFAULT NULL,
  `citric_acid` float DEFAULT NULL,
  `volatile_acidity` float DEFAULT NULL,
  `free_sulfur_dioxide` float DEFAULT NULL,
  `total_sulfur_dioxide` float DEFAULT NULL,
  `residual_sugar` float DEFAULT NULL,
  `batch_id` int DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `batch_id` (`batch_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sensors`
--

DROP TABLE IF EXISTS `sensors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensors` (
  `sensor_id` int NOT NULL,
  `model` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `line_id` int DEFAULT NULL,
  PRIMARY KEY (`sensor_id`),
  KEY `line_id` (`line_id`),
  CONSTRAINT `sensors_ibfk_1` FOREIGN KEY (`line_id`) REFERENCES `line` (`line_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `refresh_token` char(128) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `revoked_at` datetime DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `uq_refresh_token` (`refresh_token`),
  KEY `idx_user_expires` (`user_id`,`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test_random`
--

DROP TABLE IF EXISTS `test_random`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_random` (
  `score` float DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `tester_id` int DEFAULT NULL,
  `product_id` varchar(50) DEFAULT NULL,
  KEY `tester_id` (`tester_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `test_random_ibfk_1` FOREIGN KEY (`tester_id`) REFERENCES `tester` (`user_id`),
  CONSTRAINT `test_random_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tester`
--

DROP TABLE IF EXISTS `tester`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tester` (
  `user_id` int NOT NULL,
  `flavor_profile` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `update_note`
--

DROP TABLE IF EXISTS `update_note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `update_note` (
  `update_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `feature` varchar(50) DEFAULT NULL,
  `AI_model` int DEFAULT NULL,
  `engineer_id` int DEFAULT NULL,
  KEY `AI_model` (`AI_model`),
  KEY `engineer_id` (`engineer_id`),
  CONSTRAINT `update_note_ibfk_1` FOREIGN KEY (`AI_model`) REFERENCES `ai_model` (`model_id`),
  CONSTRAINT `update_note_ibfk_2` FOREIGN KEY (`engineer_id`) REFERENCES `engineer` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `exp_year` int DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `firstname` varchar(12) DEFAULT NULL,
  `lastname` varchar(12) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_users_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_users_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouse` (`warehouse_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouse` (
  `warehouse_id` int NOT NULL AUTO_INCREMENT,
  `categories` varchar(50) DEFAULT NULL,
  `owner_id` int unsigned DEFAULT NULL,
  `invitation_token` varchar(64) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`warehouse_id`),
  UNIQUE KEY `uq_invitation_token` (`invitation_token`),
  KEY `fk_warehouse_owner` (`owner_id`),
  KEY `idx_warehouse_token` (`invitation_token`),
  CONSTRAINT `fk_warehouse_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-30 16:36:46
