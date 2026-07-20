package com.waterreportsystem.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WaterReportRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String photoUrl;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Street name is required")
    private String streetName;

    @NotBlank(message = "Suburb is required")
    private String suburb;

    @NotBlank(message = "Ward number is required")
    private String wardNumber;

    @NotBlank(message = "Municipality is required")
    private String municipality;

    @NotBlank(message = "Province is required")
    private String province;

    @NotNull(message = "Resident ID is required")
    private Long residentId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
