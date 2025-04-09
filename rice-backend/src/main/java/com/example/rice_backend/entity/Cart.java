package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {
    @Id
    private String id;
    private String userEmail;
    private List<CartItem> items = new ArrayList<>();
    private double subtotal;
    private double shipping;
    private double tax;
    private double discount;
    private double total;
    // Add these fields to your Cart entity
    private String razorpayOrderId;
    private double razorpayOrderAmount;
    private Long version = 0L;

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }


    // Add getters and setters
    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public double getRazorpayOrderAmount() {
        return razorpayOrderAmount;
    }

    public void setRazorpayOrderAmount(double razorpayOrderAmount) {
        this.razorpayOrderAmount = razorpayOrderAmount;
    }

    // Constructors
    public Cart() {
    }

    public Cart(String userEmail, List<CartItem> items) {
        this.userEmail = userEmail;
        this.items = new ArrayList<>(items);
        calculateTotals();
    }

    // Method to recalculate all totals
    public void calculateTotals() {
        this.subtotal = items.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum();
        this.shipping = subtotal > 1000 ? 0 : 50;
        this.tax = subtotal * 0.05;
        this.total = subtotal + shipping + tax - discount;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = new ArrayList<>(items);
        calculateTotals();
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getShipping() {
        return shipping;
    }

    public void setShipping(double shipping) {
        this.shipping = shipping;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
        calculateTotals();
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
