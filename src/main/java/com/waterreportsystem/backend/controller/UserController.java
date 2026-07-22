package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.UpdateUserProfileRequest;
import com.waterreportsystem.backend.dto.UserProfileResponse;
import com.waterreportsystem.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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