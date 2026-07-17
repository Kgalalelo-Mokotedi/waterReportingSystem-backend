package com.waterreport.assignment.dto;

import jakarta.validation.constraints.NotNull;

/** Payload for assigning (or reassigning) a technician to a report. */
public class AssignTechnicianRequest {

    @NotNull(message = "reportId is required")
    private Long reportId;

    @NotNull(message = "technicianId is required")
    private Long technicianId;

    private String notes;

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
