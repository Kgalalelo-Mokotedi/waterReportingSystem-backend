package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;
    private final String fromEmail;
    private final long expiryMinutes;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String fromEmail,
            @Value("${app.password-reset.expiry-minutes:15}") long expiryMinutes
    ) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
        this.expiryMinutes = expiryMinutes;
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("WaterWatch SA - Password Reset");
        message.setText(
                "Hello,\n\n"
                        + "You requested to reset your password.\n\n"
                        + "Copy the reset token below and paste it into the "
                        + "\"Reset Password\" form on the WaterWatch SA login page:\n\n"
                        + token
                        + "\n\nThis token expires in " + expiryMinutes + " minutes.\n\n"
                        + "If you didn't request this, you can safely ignore this email."
        );

        try {
            mailSender.send(message);
            log.info("Password reset email sent to {}", to);
        } catch (MailException ex) {
            log.error("Failed to send password reset email to {}", to, ex);
            throw ex;
        }
    }
}