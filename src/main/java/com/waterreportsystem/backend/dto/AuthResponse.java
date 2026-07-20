package com.waterreportsystem.backend.dto;

import java.util.Set;

public class AuthResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;

    public AuthResponse(
            String token,
            String tokenType,
            Long userId,
            String firstName,
            String lastName,
            String email,
            Set<String> roles
    ) {
        this.token = token;
        this.tokenType = tokenType;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public Set<String> getRoles() {
        return roles;
    }
}
