package com.waterreportsystem.backend.service;

import com.waterreportsystem.backend.dto.LoginRequest;
import com.waterreportsystem.backend.dto.RegisterRequest;
import com.waterreportsystem.backend.response.ApiResponse;

public interface AuthService {

    ApiResponse<?> register(RegisterRequest request);

    ApiResponse<?> login(LoginRequest request);

}
