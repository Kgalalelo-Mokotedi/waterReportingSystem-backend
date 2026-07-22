package com.waterreportsystem.backend.dashboard.dto;

import com.waterreportsystem.backend.technician.AvailabilityStatus;

/** One row of the "workload per technician" breakdown on the admin dashboard. */
public class TechnicianWorkloadSummary {

    private Long technicianId;
    private String employeeNumber;
    private String fullName;
    private AvailabilityStatus availabilityStatus;
    private long activeAssignments;

    public TechnicianWorkloadSummary(Long technicianId, String employeeNumber, String fullName,
                                      AvailabilityStatus availabilityStatus, long activeAssignments) {
        this.technicianId = technicianId;
        this.employeeNumber = employeeNumber;
        this.fullName = fullName;
        this.availabilityStatus = availabilityStatus;
        this.activeAssignments = activeAssignments;
    }

    public Long getTechnicianId() { return technicianId; }
    public String getEmployeeNumber() { return employeeNumber; }
    public String getFullName() { return fullName; }
    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public long getActiveAssignments() { return activeAssignments; }
}
