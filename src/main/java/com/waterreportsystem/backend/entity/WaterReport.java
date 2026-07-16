package com.waterreportsystem.backend.entity;

import com.waterreportsystem.backend.enums.Priority;
import com.waterreportsystem.backend.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "water_reports")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WaterReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_number", nullable = false, unique = true, length = 50)
    private String referenceNumber;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status;

    @Column(name = "street_name", length = 150)
    private String streetName;

    @Column(length = 100)
    private String suburb;

    @Column(name = "ward_number", length = 20)
    private String wardNumber;

    @Column(length = 150)
    private String municipality;

    @Column(length = 100)
    private String province;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // resident_id -> the User entity belongs to Mkay's module.
    // We reference it as a plain Long for now so this compiles independently.
    // Once his User entity exists, this can become a proper @ManyToOne relationship.
    @Column(name = "resident_id", nullable = false)
    private Long residentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private IssueCategory category;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = (this.status == null) ? Status.REPORTED : this.status;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}