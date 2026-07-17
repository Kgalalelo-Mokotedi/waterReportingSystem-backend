package com.waterreportsystem.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class IssueCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private Boolean active;
}
