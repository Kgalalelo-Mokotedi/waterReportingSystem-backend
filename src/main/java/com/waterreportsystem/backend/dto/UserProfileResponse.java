package com.waterreportsystem.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserProfileResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private boolean enabled;

    private LocalDateTime createdAt;

    private Set<String> roles;
}