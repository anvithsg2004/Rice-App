package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "carts")
public class Cart {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items;
    private double subtotal;
    private double shipping;
    private double tax;
    private double discount;
    private double total;

    // No-Arg Constructor
    public Cart() {
    }

    // All-Arg Constructor
    public Cart(String id, String userId, List<CartItem> items, double subtotal, double shipping, double tax, double discount, double total) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.subtotal = subtotal;
        this.shipping = shipping;
        this.tax = tax;
        this.discount = discount;
        this.total = total;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public double getShipping() {
        return shipping;
    }

    public double getTax() {
        return tax;
    }

    public double getDiscount() {
        return discount;
    }

    public double getTotal() {
        return total;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public void setShipping(double shipping) {
        this.shipping = shipping;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
