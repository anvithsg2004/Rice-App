package com.example.rice_backend.service;

import com.example.rice_backend.entity.User;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {
    private final Cache<String, RegistrationOTP> otpCache =
            Caffeine.newBuilder()
                    .expireAfterWrite(5, TimeUnit.MINUTES)
                    .build();

    private final JavaMailSender mailSender;
    private final UserService userService;

    public OTPService(JavaMailSender mailSender, UserService userService) {
        this.mailSender = mailSender;
        this.userService = userService;
    }

    public void generateAndSendOTP(User user) {
        if (userService.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }

        String otp = String.format("%06d", new Random().nextInt(999999));
        otpCache.put(user.getEmail(), new RegistrationOTP(user, otp));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("RiceGlory Registration OTP");
        message.setText("Your OTP is: " + otp + "\nValid for 5 minutes");
        mailSender.send(message);
    }

    public boolean verifyOTP(String email, String otp) {
        RegistrationOTP stored = otpCache.getIfPresent(email);
        if (stored == null) {
            throw new RuntimeException("OTP expired or not generated");
        }
        if (!stored.getOtp().equals(otp)) {
            return false;
        }

        userService.saveUser(stored.getUser());
        otpCache.invalidate(email);
        return true;
    }

    private static class RegistrationOTP {
        private final User user;
        private final String otp;

        public RegistrationOTP(User user, String otp) {
            this.user = user;
            this.otp = otp;
        }

        public User getUser() {
            return user;
        }

        public String getOtp() {
            return otp;
        }
    }
}
