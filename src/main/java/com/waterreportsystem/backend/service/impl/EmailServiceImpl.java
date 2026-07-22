package com.waterreportsystem.backend.service.impl;


import com.waterreportsystem.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {

        String resetLink = "http://localhost:3000/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("WaterWatch SA - Password Reset");
        message.setText(
                "Hello,\n\n"
                        + "You requested to reset your password.\n\n"
                        + "Click the link below to reset it:\n"
                        + resetLink
                        + "\n\nThis link expires in 15 minutes.\n\n"
                        + "If you didn't request this, you can safely ignore this email."
        );

        mailSender.send(message);
    }
}