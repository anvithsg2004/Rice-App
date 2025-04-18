package com.example.rice_backend.controller;

import com.example.rice_backend.entity.LoginRequest;
import com.example.rice_backend.entity.PaymentMethod;
import com.example.rice_backend.entity.User;
import com.example.rice_backend.extra.UPIRequest;
import com.example.rice_backend.repository.UserRepository;
import com.example.rice_backend.service.OTPService;
import com.example.rice_backend.service.UserService;
import com.example.rice_backend.utility.SecurityUtils;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OTPService otpService;

    @PostMapping("/start-registration")
    public ResponseEntity<?> startRegistration(@RequestBody User user) {
        try {
            otpService.generateAndSendOTP(user);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        try {
            boolean isValid = otpService.verifyOTP(
                    request.get("email"),
                    request.get("otp")
            );
            return isValid ? ResponseEntity.ok().build()
                    : ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Get user by email (public for testing)
    @GetMapping("/email/{email}")
    public ResponseEntity<User> findByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

//    @PostMapping("/login")
//    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
//        try{
//            boolean isAuthenticated = userService.authenticate(loginRequest.getUsername(),loginRequest.getPassword());
//
//            if (isAuthenticated){
//                session.setAttribute("user", loginRequest.getUsername());
//                return ResponseEntity.ok("Login was successful!");
//            } else {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unknown error occurred");
//        }
//    }

//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
//        String email = credentials.get("email");
//        String password = credentials.get("password");
//
//        User user = userService.findByEmail(email);
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
//        }
//
//        if (userService.checkPassword(user, password)) {
//            return ResponseEntity.ok().build();
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
//        }
//    }

//    @GetMapping("/email/{email}")
//    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
//        User user = userService.getUserByEmail(email);
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }

    // Register new user
    @PostMapping("/users")
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        try {
            User savedUser = userService.saveUser(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get user by ID (requires authentication)
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{userId}/add-upi")
    public ResponseEntity<User> addUPI(
            @PathVariable String userId,
            @RequestBody String upi
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String currentUserId = userService.findUserIdByEmail(userEmail);

        if (!userId.equals(currentUserId)) {
            throw new AccessDeniedException("User ID mismatch");
        }

        User user = userService.addUPI(userId, upi);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}/remove-upi")
    public ResponseEntity<User> removeUPI(
            @PathVariable String userId,
            @RequestBody UPIRequest upiRequest
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String currentUserId = userService.findUserIdByEmail(userEmail);

        if (!userId.equals(currentUserId)) {
            throw new AccessDeniedException("User ID mismatch");
        }

        String upi = upiRequest.getUpi();
        User user = userService.removeUPI(userId, upi);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/{userId}/add-payment-method")
    public ResponseEntity<User> addPaymentMethod(
            @PathVariable String userId,
            @RequestBody PaymentMethod paymentMethod
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String currentUserId = userService.findUserIdByEmail(userEmail);

        if (!userId.equals(currentUserId)) {
            throw new AccessDeniedException("User ID mismatch");
        }

        User user = userService.addPaymentMethod(userId, paymentMethod);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{userId}/remove-payment-method")
    public ResponseEntity<User> removePaymentMethod(
            @PathVariable String userId,
            @RequestBody PaymentMethod paymentMethod
    ) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        String currentUserId = userService.findUserIdByEmail(userEmail);

        if (!userId.equals(currentUserId)) {
            throw new AccessDeniedException("User ID mismatch");
        }

        User user = userService.removePaymentMethod(userId, paymentMethod);
        return ResponseEntity.ok(user);
    }
}
