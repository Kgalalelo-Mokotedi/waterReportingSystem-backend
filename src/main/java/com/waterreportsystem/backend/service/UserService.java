package com.waterreportsystem.backend.service;

import com.waterreportsystem.backend.dto.UpdateUserProfileRequest;
import com.waterreportsystem.backend.dto.UserProfileResponse;

public interface UserService {

    UserProfileResponse getMyProfile();

    UserProfileResponse updateMyProfile(
            UpdateUserProfileRequest request
    );
}