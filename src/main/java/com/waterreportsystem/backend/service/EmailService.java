package com.waterreportsystem.backend.service;

public interface EmailService {

    void sendPasswordResetEmail(String to, String token);

}