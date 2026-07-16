package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.dto.LoginRequest;
import com.waterreportsystem.backend.dto.RegisterRequest;
import com.waterreportsystem.backend.entity.Role;
import com.waterreportsystem.backend.entity.User;
import com.waterreportsystem.backend.exception.ResourceAlreadyExistsException;
import com.waterreportsystem.backend.repository.RoleRepository;
import com.waterreportsystem.backend.repository.UserRepository;
import com.waterreportsystem.backend.response.ApiResponse;
import com.waterreportsystem.backend.service.AuthService;
import com.waterreportsystem.backend.dto.AuthResponse;
import com.waterreportsystem.backend.security.CustomUserDetails;
import com.waterreportsystem.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public ApiResponse<?> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException(
                    "Email is already registered"
            );
        }

        Role residentRole = roleRepository.findByName("RESIDENT")
                .orElseThrow(() -> new RuntimeException("RESIDENT role not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .roles(Set.of(residentRole))
                .build();

        User savedUser = userRepository.save(user);

        return new ApiResponse<>(
                true,
                "User registered successfully",
                savedUser.getEmail()
        );
    }

    @Override
    public ApiResponse<?> login(LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        CustomUserDetails userDetails =
                (CustomUserDetails) authentication.getPrincipal();

        User user = userDetails.getUser();

        String token = jwtService.generateToken(user);

        Set<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(java.util.stream.Collectors.toSet());

        AuthResponse authResponse = new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                roles
        );

        return new ApiResponse<>(
                true,
                "Login successful",
                authResponse
        );
    }
}