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
-- Table structure for table `report_assignments`
--

DROP TABLE IF EXISTS `report_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_assignments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_at` datetime(6) DEFAULT NULL,
  `assignment_status` enum('ACCEPTED','ASSIGNED','CANCELLED','COMPLETED','IN_PROGRESS','REASSIGNED') NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `report_id` bigint NOT NULL,
  `technician_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKclg8ut3gtpbimmwfktli6r1cq` (`report_id`),
  KEY `FKjrf8sw0q90bhnc4nuwibnl9q0` (`technician_id`),
  CONSTRAINT `FKclg8ut3gtpbimmwfktli6r1cq` FOREIGN KEY (`report_id`) REFERENCES `water_reports` (`id`),
  CONSTRAINT `FKjrf8sw0q90bhnc4nuwibnl9q0` FOREIGN KEY (`technician_id`) REFERENCES `technicians` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_assignments`
--

LOCK TABLES `report_assignments` WRITE;
/*!40000 ALTER TABLE `report_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_assignments` ENABLE KEYS */;
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

-- Dump completed on 2026-07-20 10:44:30
