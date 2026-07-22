-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: water_report_system_db
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '10ed900f-6566-11f1-b2a9-40c2ba2a55ce:1-170';

--
-- Table structure for table `water_reports`
--

DROP TABLE IF EXISTS `water_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `water_reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `municipality` varchar(150) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `priority` enum('EMERGENCY','HIGH','LOW','MEDIUM') NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `reference_number` varchar(50) NOT NULL,
  `resident_id` bigint NOT NULL,
  `resolved_at` datetime(6) DEFAULT NULL,
  `status` enum('ASSIGNED','IN_PROGRESS','REJECTED','REPORTED','RESOLVED') NOT NULL,
  `street_name` varchar(150) DEFAULT NULL,
  `suburb` varchar(100) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward_number` varchar(20) DEFAULT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6tsrhu8ec9v2gqhqsbknhabg` (`reference_number`),
  KEY `FKhp2vnej5h2kpvrou11f0yhunl` (`category_id`),
  CONSTRAINT `FKhp2vnej5h2kpvrou11f0yhunl` FOREIGN KEY (`category_id`) REFERENCES `issue_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `water_reports`
--

LOCK TABLES `water_reports` WRITE;
/*!40000 ALTER TABLE `water_reports` DISABLE KEYS */;
INSERT INTO `water_reports` VALUES (1,'2026-07-17 21:16:45.006148','A burst pipe is leaking water into the street.','City Municipality','','HIGH','Gauteng','4689E076',4,'2026-07-17 23:35:52.067471','IN_PROGRESS','Main Road','Central','Burst water pipe','2026-07-17 23:42:10.139246','12',1);
/*!40000 ALTER TABLE `water_reports` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-20 10:44:29
