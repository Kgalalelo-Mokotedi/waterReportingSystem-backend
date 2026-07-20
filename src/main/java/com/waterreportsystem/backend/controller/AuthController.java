package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.LoginRequest;
import com.waterreportsystem.backend.dto.RegisterRequest;
import com.waterreportsystem.backend.response.ApiResponse;
import com.waterreportsystem.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173") // Allows Vite dev server to connect
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
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

    
}
