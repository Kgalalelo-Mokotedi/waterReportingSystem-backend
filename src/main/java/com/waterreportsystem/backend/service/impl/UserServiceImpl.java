package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.dto.UpdateUserProfileRequest;
import com.waterreportsystem.backend.dto.UserProfileResponse;
import com.waterreportsystem.backend.entity.User;
import com.waterreportsystem.backend.repository.UserRepository;
import com.waterreportsystem.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile() {
        User user = getAuthenticatedUser();

        return mapToResponse(user);
    }

    @Override
    public UserProfileResponse updateMyProfile(
            UpdateUserProfileRequest request
    ) {
        User user = getAuthenticatedUser();

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());

        String phoneNumber = request.getPhoneNumber();

        if (phoneNumber == null || phoneNumber.isBlank()) {
            user.setPhoneNumber(null);
        } else {
            user.setPhoneNumber(phoneNumber.trim());
        }

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    private User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (
                authentication == null
                        || !authentication.isAuthenticated()
                        || "anonymousUser".equals(
                        authentication.getPrincipal()
                )
        ) {
            throw new RuntimeException(
                    "No authenticated user was found"
            );
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user was not found"
                        )
                );
    }

    private UserProfileResponse mapToResponse(User user) {
        UserProfileResponse response =
                new UserProfileResponse();

        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());

        response.setRoles(
                user.getRoles()
                        .stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toSet())
        );

        return response;
    }
}