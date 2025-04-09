package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String name;
    private String phoneNumber;
    private String address;
    private String email;
    private String password;
    private List<String> savedUPI;
    private List<PaymentMethod> savedCards;

    // No-args constructor
    public User() {
    }

    // All-args constructor
    public User(String id, String name, String phoneNumber, String address, String email, String password, List<String> savedUPI, List<PaymentMethod> savedCards) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.email = email;
        this.password = password;
        this.savedUPI = savedUPI;
        this.savedCards = savedCards;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getSavedUPI() {
        return savedUPI;
    }

    public void setSavedUPI(List<String> savedUPI) {
        this.savedUPI = savedUPI;
    }

    public List<PaymentMethod> getSavedCards() {
        return savedCards;
    }

    public void setSavedCards(List<PaymentMethod> savedCards) {
        this.savedCards = savedCards;
    }
}
