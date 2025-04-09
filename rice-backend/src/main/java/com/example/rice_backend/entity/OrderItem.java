package com.example.rice_backend.entity;

public class OrderItem {
    private String itemId;
    private String name;
    private double weight;
    private double price;
    private int quantity;

    // No-Arg Constructor
    public OrderItem() {
    }

    // All-Arg Constructor
    public OrderItem(String itemId, String name, double weight, double price, int quantity) {
        this.itemId = itemId;
        this.name = name;
        this.weight = weight;
        this.price = price;
        this.quantity = quantity;
    }

    // Getters
    public String getItemId() {
        return itemId;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    // Setters
    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
