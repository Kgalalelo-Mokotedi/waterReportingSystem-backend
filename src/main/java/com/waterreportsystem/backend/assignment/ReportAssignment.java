package com.waterreport.assignment;

import com.waterreport.report.WaterReport;
import com.waterreport.technician.Technician;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Links a Technician to a WaterReport. One report can have multiple
 * ReportAssignment rows over time (e.g. if reassigned), but only one
 * should be "active" at once — the service layer enforces that.
 */
@Entity
@Table(name = "report_assignments")
public class ReportAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private WaterReport report;

    @ManyToOne
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", length = 30, nullable = false)
    private AssignmentStatus assignmentStatus = AssignmentStatus.ASSIGNED;

    @Column(name = "assigned_at", updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(length = 255)
    private String notes;

    @PrePersist
    protected void onCreate() {
        this.assignedAt = LocalDateTime.now();
    }

    public ReportAssignment() {}

    public ReportAssignment(WaterReport report, Technician technician, String notes) {
        this.report = report;
        this.technician = technician;
        this.notes = notes;
    }

    // --- getters / setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WaterReport getReport() { return report; }
    public void setReport(WaterReport report) { this.report = report; }

    public Technician getTechnician() { return technician; }
    public void setTechnician(Technician technician) { this.technician = technician; }

    public AssignmentStatus getAssignmentStatus() { return assignmentStatus; }
    public void setAssignmentStatus(AssignmentStatus assignmentStatus) { this.assignmentStatus = assignmentStatus; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
