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
    private List<String> savedUPI;
    private List<PaymentMethod> savedCards;

    // No-Arg Constructor
    public User() {
    }

    // All-Arg Constructor
    public User(String id, String name, String phoneNumber, String address, String email, List<String> savedUPI, List<PaymentMethod> savedCards) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.email = email;
        this.savedUPI = savedUPI;
        this.savedCards = savedCards;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getSavedUPI() {
        return savedUPI;
    }

    public List<PaymentMethod> getSavedCards() {
        return savedCards;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSavedUPI(List<String> savedUPI) {
        this.savedUPI = savedUPI;
    }

    public void setSavedCards(List<PaymentMethod> savedCards) {
        this.savedCards = savedCards;
    }
}
