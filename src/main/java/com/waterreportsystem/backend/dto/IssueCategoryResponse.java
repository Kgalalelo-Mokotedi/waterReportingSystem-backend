package com.waterreportsystem.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IssueCategoryResponse {

    private Long id;

    private String name;

    private String description;

    private Boolean active;

    private LocalDateTime createdAt;
}