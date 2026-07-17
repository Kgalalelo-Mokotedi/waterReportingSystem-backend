package com.waterreport.technician.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Payload for creating/updating a technician profile (Admin only). */
public class TechnicianRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "employeeNumber is required")
    private String employeeNumber;

    private String specialisation;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }

    public String getSpecialisation() { return specialisation; }
    public void setSpecialisation(String specialisation) { this.specialisation = specialisation; }
}
