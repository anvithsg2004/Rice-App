package com.example.rice_backend.controller;

import com.example.rice_backend.entity.PaymentMethod;
import com.example.rice_backend.entity.User;
import com.example.rice_backend.extra.UPIRequest;
import com.example.rice_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
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

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/{userId}/add-upi")
    public ResponseEntity<User> addUPI(@PathVariable String userId, @RequestBody Map<String, String> requestBody) {
        System.out.println("Came inside the Add UPI Method");
        String upi = requestBody.get("upi");
        User user = userService.addUPI(userId, upi);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/remove-upi")
    public ResponseEntity<User> removeUPI(@PathVariable String userId, @RequestBody UPIRequest upiRequest) {
        System.out.println("Came inside the Remove UPI Method");
        String upi = upiRequest.getUpi();
        User user = userService.removeUPI(userId, upi);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/{userId}/add-payment-method")
    public ResponseEntity<User> addPaymentMethod(@PathVariable String userId, @RequestBody PaymentMethod paymentMethod) {
        User user = userService.addPaymentMethod(userId, paymentMethod);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/remove-payment-method")
    public ResponseEntity<User> removePaymentMethod(@PathVariable String userId, @RequestBody PaymentMethod paymentMethod) {
        System.out.println("Came inside the Remove Payment Method");
        User user = userService.removePaymentMethod(userId, paymentMethod);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
