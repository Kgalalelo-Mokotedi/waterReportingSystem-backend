package com.waterreportsystem.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WaterReportResponse {

    private Long id;

    private String referenceNumber;

    private String title;

    private String description;

    private String photoUrl;

    private String priority;

    private String status;

    private String streetName;

    private String suburb;

    private String wardNumber;

    private String municipality;

    private String province;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;

    private Long residentId;

    private Long categoryId;
}
