package com.example.rice_backend.entity;

import java.util.Objects;

public class PaymentMethod {
    private String number;
    private String expiry;
    private String cvv;

    // No-Arg Constructor
    public PaymentMethod() {
    }

    // All-Arg Constructor
    public PaymentMethod(String number, String expiry, String cvv) {
        this.number = number;
        this.expiry = expiry;
        this.cvv = cvv;
    }

    // Getters and Setters
    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getExpiry() {
        return expiry;
    }

    public void setExpiry(String expiry) {
        this.expiry = expiry;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    // Override equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PaymentMethod that = (PaymentMethod) o;
        return Objects.equals(number, that.number) &&
                Objects.equals(expiry, that.expiry) &&
                Objects.equals(cvv, that.cvv);
    }

    @Override
    public int hashCode() {
        return Objects.hash(number, expiry, cvv);
    }

    @Override
    public String toString() {
        return "PaymentMethod{" +
                "number='" + number + '\'' +
                ", expiry='" + expiry + '\'' +
                ", cvv='" + cvv + '\'' +
                '}';
    }
}
