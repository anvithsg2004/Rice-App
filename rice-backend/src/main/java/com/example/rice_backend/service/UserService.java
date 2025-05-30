package com.example.rice_backend.service;

import com.example.rice_backend.entity.PaymentMethod;
import com.example.rice_backend.entity.User;
import com.example.rice_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public boolean authenticate(String username, String password) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) { // Use user.getPassword()
            throw new BadCredentialsException("Invalid password");
        }
        return true;
    }

    public String findUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getId();
    }

    public User saveUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setSavedUPI(new ArrayList<>());
        user.setSavedCards(new ArrayList<>());
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(String userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        existingUser.setName(updatedUser.getName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setEmail(updatedUser.getEmail());
        return userRepository.save(existingUser);
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User addUPI(String userId, String upi) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User retrieved: " + user.toString());
        if (user.getSavedUPI() == null) {
            System.out.println("Saved UPI is null, creating new list");
            user.setSavedUPI(new ArrayList<>());
        }
        System.out.println("Adding UPI: " + upi);
        user.getSavedUPI().add(upi);
        System.out.println("User after adding UPI: " + user.toString());
        return userRepository.save(user);
    }

    public User removeUPI(String userId, String upi) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getSavedUPI() != null) {
            user.getSavedUPI().remove(upi);
        }
        return userRepository.save(user);
    }

    public User addPaymentMethod(String userId, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getSavedCards() == null) {
            user.setSavedCards(List.of());
        }
        user.getSavedCards().add(paymentMethod);
        return userRepository.save(user);
    }

    public User removePaymentMethod(String userId, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Debugging statement: Print user details before removal
        System.out.println("User retrieved: " + user.toString());

        if (user.getSavedCards() != null) {
            // Debugging statement: Print payment method details before removal
            System.out.println("Payment method to remove: " + paymentMethod.toString());

            // Use removeIf to find and remove the matching payment method
            user.getSavedCards().removeIf(card -> card.equals(paymentMethod));

            // Debugging statement: Print payment methods after removal
            System.out.println("Payment methods after removal: " + user.getSavedCards());
        } else {
            // Debugging statement: SavedCards is null
            System.out.println("SavedCards is null, no payment methods to remove.");
        }

        // Debugging statement: Print user details after update
        System.out.println("User after removing payment method: " + user.toString());

        return userRepository.save(user);
    }
}
