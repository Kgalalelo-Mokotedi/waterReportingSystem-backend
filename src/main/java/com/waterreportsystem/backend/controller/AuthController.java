package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.LoginRequest;
import com.waterreportsystem.backend.dto.RegisterRequest;
import com.waterreportsystem.backend.response.ApiResponse;
import com.waterreportsystem.backend.service.AuthService;
import com.waterreportsystem.backend.dto.ForgotPasswordRequest;
import com.waterreportsystem.backend.dto.ResetPasswordRequest;
import com.waterreportsystem.backend.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173") // Allows Vite dev server to connect
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(
            AuthService authService,
            PasswordResetService passwordResetService
    ) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        ApiResponse<?> response = authService.register(request);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        ApiResponse<?> response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordResetService.requestPasswordReset(request.getEmail());

        return ApiResponse.ok(
                "If the email exists, a password reset link has been generated.",
                null
        );
    }
    @PostMapping("/reset-password")
    public ApiResponse<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return ApiResponse.ok(
                "Password reset successfully.",
                null
        );
    }

    
}
