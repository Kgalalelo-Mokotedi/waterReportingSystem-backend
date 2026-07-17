package com.waterreport.statusupdate.dto;

import com.waterreport.report.ReportStatus;
import com.waterreport.statusupdate.StatusUpdate;
import java.time.LocalDateTime;

public class StatusUpdateResponse {

    private Long id;
    private Long reportId;
    private String reportReferenceNumber;
    private Long technicianId;
    private String technicianEmployeeNumber;
    private ReportStatus newStatus;
    private String comment;
    private LocalDateTime createdAt;

    public static StatusUpdateResponse fromEntity(StatusUpdate s) {
        StatusUpdateResponse dto = new StatusUpdateResponse();
        dto.id = s.getId();
        dto.newStatus = s.getNewStatus();
        dto.comment = s.getComment();
        dto.createdAt = s.getCreatedAt();
        if (s.getReport() != null) {
            dto.reportId = s.getReport().getId();
            dto.reportReferenceNumber = s.getReport().getReferenceNumber();
        }
        if (s.getTechnician() != null) {
            dto.technicianId = s.getTechnician().getId();
            dto.technicianEmployeeNumber = s.getTechnician().getEmployeeNumber();
        }
        return dto;
    }

    public Long getId() { return id; }
    public Long getReportId() { return reportId; }
    public String getReportReferenceNumber() { return reportReferenceNumber; }
    public Long getTechnicianId() { return technicianId; }
    public String getTechnicianEmployeeNumber() { return technicianEmployeeNumber; }
    public ReportStatus getNewStatus() { return newStatus; }
    public String getComment() { return comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
