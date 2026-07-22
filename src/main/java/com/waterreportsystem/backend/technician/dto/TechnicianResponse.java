package com.waterreportsystem.backend.technician.dto;

import com.waterreportsystem.backend.technician.AvailabilityStatus;
import com.waterreportsystem.backend.technician.Technician;
import java.time.LocalDateTime;

public class TechnicianResponse {

    private Long id;
    private String employeeNumber;
    private String specialisation;
    private AvailabilityStatus availabilityStatus;
    private Long userId;
    private String fullName;
    private LocalDateTime createdAt;

    public static TechnicianResponse fromEntity(Technician t) {
        TechnicianResponse dto = new TechnicianResponse();
        dto.id = t.getId();
        dto.employeeNumber = t.getEmployeeNumber();
        dto.specialisation = t.getSpecialisation();
        dto.availabilityStatus = t.getAvailabilityStatus();
        dto.createdAt = t.getCreatedAt();
        if (t.getUser() != null) {
            dto.userId = t.getUser().getId();
            dto.fullName = t.getUser().getFirstName() + " " + t.getUser().getLastName();
        }
        return dto;
    }

    public Long getId() { return id; }
    public String getEmployeeNumber() { return employeeNumber; }
    public String getSpecialisation() { return specialisation; }
    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public Long getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
