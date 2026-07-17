package com.waterreport.statusupdate.dto;

import com.waterreport.report.ReportStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Payload for a technician logging a progress update on a report. */
public class StatusUpdateRequest {

    @NotNull(message = "reportId is required")
    private Long reportId;

    @NotNull(message = "technicianId is required")
    private Long technicianId;

    @NotNull(message = "newStatus is required")
    private ReportStatus newStatus;

    @Size(max = 500, message = "comment must be under 500 characters")
    private String comment;

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public ReportStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ReportStatus newStatus) { this.newStatus = newStatus; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
