package com.waterreport.report;

import com.waterreport.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * PLACEHOLDER — Member 3 (Water Report Module) owns the real WaterReport
 * entity (title, description, photo, priority, location fields, etc.).
 *
 * Only the fields the Technician & Admin module actually touches are
 * included here so this module compiles independently. Replace with the
 * real entity when you merge branches — keep the field names the same
 * (or update the references in ReportAssignment / StatusUpdate / the
 * dashboard queries).
 */
@Entity
@Table(name = "water_reports")
public class WaterReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", length = 50)
    private String referenceNumber;

    @Column(length = 150)
    private String title;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @Column(length = 30)
    private String priority; // LOW, MEDIUM, HIGH, EMERGENCY — Member 3's enum

    @Column(length = 100)
    private String suburb;

    @ManyToOne
    @JoinColumn(name = "resident_id")
    private User resident;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // --- getters / setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getSuburb() { return suburb; }
    public void setSuburb(String suburb) { this.suburb = suburb; }

    public User getResident() { return resident; }
    public void setResident(User resident) { this.resident = resident; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
