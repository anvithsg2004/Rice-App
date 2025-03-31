package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "promo_codes")
public class PromoCode {
    @Id
    private String id;
    private String code;
    private double discountPercentage;
    private double discountAmount;
    private boolean freeShipping;
    private Date expiryDate;
    private boolean active;

    // No-Arg Constructor
    public PromoCode() {
    }

    // All-Arg Constructor
    public PromoCode(String id, String code, double discountPercentage, double discountAmount, boolean freeShipping, Date expiryDate, boolean active) {
        this.id = id;
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.discountAmount = discountAmount;
        this.freeShipping = freeShipping;
        this.expiryDate = expiryDate;
        this.active = active;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public boolean isFreeShipping() {
        return freeShipping;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public boolean isActive() {
        return active;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDiscountPercentage(double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public void setFreeShipping(boolean freeShipping) {
        this.freeShipping = freeShipping;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
