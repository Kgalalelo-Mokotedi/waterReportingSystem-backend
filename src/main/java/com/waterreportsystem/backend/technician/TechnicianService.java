package com.waterreportsystem.backend.technician;

import com.waterreportsystem.backend.technician.dto.TechnicianRequest;
import com.waterreportsystem.backend.technician.dto.TechnicianResponse;
import com.waterreportsystem.backend.entity.User;
import com.waterreportsystem.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TechnicianService {

    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;

    public TechnicianService(
            TechnicianRepository technicianRepository,
            UserRepository userRepository
    ) {
        this.technicianRepository = technicianRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TechnicianResponse addTechnician(TechnicianRequest request) {
        if (technicianRepository.existsByEmployeeNumber(request.getEmployeeNumber())) {
            throw new IllegalArgumentException("Employee number already in use: " + request.getEmployeeNumber());
        }
        if (technicianRepository.findByUserId(request.getUserId()).isPresent()) {
            throw new IllegalArgumentException("This user already has a technician profile");
        }

        // NOTE: once the real User entity/repository exists, look the user
        // up with userRepository.findById(...).orElseThrow(...) instead of
        // building a reference like this.
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "User not found: " + request.getUserId()
                ));

        Technician technician = new Technician(
                request.getEmployeeNumber(),
                request.getSpecialisation(),
                user
        );

        return TechnicianResponse.fromEntity(technicianRepository.save(technician));
    }

    public List<TechnicianResponse> getAllTechnicians() {
        return technicianRepository.findAll().stream()
                .map(TechnicianResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TechnicianResponse getTechnicianById(Long id) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found: " + id));
        return TechnicianResponse.fromEntity(technician);
    }

    public List<TechnicianResponse> getAvailableTechnicians() {
        return technicianRepository.findByAvailabilityStatus(AvailabilityStatus.AVAILABLE).stream()
                .map(TechnicianResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public TechnicianResponse updateTechnician(Long id, TechnicianRequest request) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found: " + id));

        technician.setSpecialisation(request.getSpecialisation());
        if (request.getEmployeeNumber() != null && !request.getEmployeeNumber().equals(technician.getEmployeeNumber())) {
            if (technicianRepository.existsByEmployeeNumber(request.getEmployeeNumber())) {
                throw new IllegalArgumentException("Employee number already in use: " + request.getEmployeeNumber());
            }
            technician.setEmployeeNumber(request.getEmployeeNumber());
        }

        return TechnicianResponse.fromEntity(technicianRepository.save(technician));
    }

    @Transactional
    public TechnicianResponse updateAvailability(Long id, AvailabilityStatus status) {
        Technician technician = technicianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Technician not found: " + id));
        technician.setAvailabilityStatus(status);
        return TechnicianResponse.fromEntity(technicianRepository.save(technician));
    }

    @Transactional
    public void deleteTechnician(Long id) {
        if (!technicianRepository.existsById(id)) {
            throw new EntityNotFoundException("Technician not found: " + id);
        }
        technicianRepository.deleteById(id);
    }
}
