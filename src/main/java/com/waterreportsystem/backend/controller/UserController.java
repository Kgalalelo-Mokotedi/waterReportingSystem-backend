package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.UpdateUserProfileRequest;
import com.waterreportsystem.backend.dto.UserProfileResponse;
import com.waterreportsystem.backend.entity.User;
import com.waterreportsystem.backend.repository.UserRepository;
import com.waterreportsystem.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/me")
    public UserProfileResponse getMyProfile() {
        return userService.getMyProfile();
    }

    @PutMapping("/me")
    public UserProfileResponse updateMyProfile(
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return userService.updateMyProfile(request);
    }
}