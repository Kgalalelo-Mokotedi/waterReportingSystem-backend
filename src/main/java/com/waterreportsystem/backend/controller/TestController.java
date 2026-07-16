package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public ResponseEntity<ApiResponse<String>> protectedEndpoint() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "You are authenticated",
                        "Protected endpoint accessed successfully"
                )
        );
    }
}