package com.example.rice_backend.entity;

public class OrderItem {
    private String itemId;
    private String name;
    private String weight;
    private double price;
    private int quantity;

    // No-Arg Constructor
    public OrderItem() {
    }

    // All-Arg Constructor
    public OrderItem(String itemId, String name, String weight, double price, int quantity) {
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

    public String getWeight() {
        return weight;
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

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
