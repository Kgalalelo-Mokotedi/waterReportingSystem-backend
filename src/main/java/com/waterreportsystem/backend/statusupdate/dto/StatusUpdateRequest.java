package com.waterreportsystem.backend.statusupdate.dto;

import com.waterreportsystem.backend.enums.Status;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Payload for a technician logging a progress update on a report. */
public class StatusUpdateRequest {

    @NotNull(message = "reportId is required")
    private Long reportId;

    @NotNull(message = "technicianId is required")
    private Long technicianId;

    @NotNull(message = "newStatus is required")
    private Status newStatus;

    @Size(max = 500, message = "comment must be under 500 characters")
    private String comment;

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public Status getNewStatus() { return newStatus; }
    public void setNewStatus(Status newStatus) { this.newStatus = newStatus; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
