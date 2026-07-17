package com.waterreport.statusupdate;

import com.waterreport.report.ReportStatus;
import com.waterreport.report.WaterReport;
import com.waterreport.technician.Technician;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * A single progress log entry a technician adds to a report — e.g.
 * "Arrived on site", "Parts ordered", "Repair complete". Together these
 * form the report's status history / audit trail.
 */
@Entity
@Table(name = "status_updates")
public class StatusUpdate {

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
    @Column(name = "new_status", length = 30, nullable = false)
    private ReportStatus newStatus;

    @Column(length = 500)
    private String comment;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public StatusUpdate() {}

    public StatusUpdate(WaterReport report, Technician technician, ReportStatus newStatus, String comment) {
        this.report = report;
        this.technician = technician;
        this.newStatus = newStatus;
        this.comment = comment;
    }

    // --- getters / setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public WaterReport getReport() { return report; }
    public void setReport(WaterReport report) { this.report = report; }

    public Technician getTechnician() { return technician; }
    public void setTechnician(Technician technician) { this.technician = technician; }

    public ReportStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ReportStatus newStatus) { this.newStatus = newStatus; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
