package com.waterreportsystem.backend.assignment.dto;

import com.waterreportsystem.backend.assignment.AssignmentStatus;
import com.waterreportsystem.backend.assignment.ReportAssignment;
import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long id;
    private Long reportId;
    private String reportReferenceNumber;
    private Long technicianId;
    private String technicianEmployeeNumber;
    private AssignmentStatus assignmentStatus;
    private LocalDateTime assignedAt;
    private LocalDateTime completedAt;
    private String notes;

    public static AssignmentResponse fromEntity(ReportAssignment a) {
        AssignmentResponse dto = new AssignmentResponse();
        dto.id = a.getId();
        dto.assignmentStatus = a.getAssignmentStatus();
        dto.assignedAt = a.getAssignedAt();
        dto.completedAt = a.getCompletedAt();
        dto.notes = a.getNotes();
        if (a.getReport() != null) {
            dto.reportId = a.getReport().getId();
            dto.reportReferenceNumber = a.getReport().getReferenceNumber();
        }
        if (a.getTechnician() != null) {
            dto.technicianId = a.getTechnician().getId();
            dto.technicianEmployeeNumber = a.getTechnician().getEmployeeNumber();
        }
        return dto;
    }

    public Long getId() { return id; }
    public Long getReportId() { return reportId; }
    public String getReportReferenceNumber() { return reportReferenceNumber; }
    public Long getTechnicianId() { return technicianId; }
    public String getTechnicianEmployeeNumber() { return technicianEmployeeNumber; }
    public AssignmentStatus getAssignmentStatus() { return assignmentStatus; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public String getNotes() { return notes; }
}
