package com.waterreportsystem.backend.technician;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    Optional<Technician> findByUserId(Long userId);

    Optional<Technician> findByEmployeeNumber(String employeeNumber);

    boolean existsByEmployeeNumber(String employeeNumber);

    List<Technician> findByAvailabilityStatus(AvailabilityStatus status);

    long countByAvailabilityStatus(AvailabilityStatus status);
}
