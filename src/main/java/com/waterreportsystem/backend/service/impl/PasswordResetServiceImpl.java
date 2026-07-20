package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.entity.PasswordResetToken;
import com.waterreportsystem.backend.entity.User;
import com.waterreportsystem.backend.repository.PasswordResetTokenRepository;
import com.waterreportsystem.backend.repository.UserRepository;
import com.waterreportsystem.backend.service.EmailService;
import com.waterreportsystem.backend.service.PasswordResetService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetServiceImpl(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        // Do not reveal whether the email exists.
        if (user == null) {
            return;
        }

        // Remove any existing reset token.
        tokenRepository.findByUserId(user.getId())
                .ifPresent(tokenRepository::delete);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);

        PasswordResetToken savedToken = tokenRepository.save(resetToken);

        // Send the password reset email
        emailService.sendPasswordResetEmail(
                user.getEmail(),
                savedToken.getToken()
        );
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid password reset token")
                );

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException(
                    "Password reset token has already been used"
            );
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Password reset token has expired"
            );
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}