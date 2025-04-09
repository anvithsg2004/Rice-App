package com.example.rice_backend.entity;

public class CartItem {
    private String itemId;
    private String name;
    private String imageUrl;
    private double price;
    private int quantity;
    private int maxQuantity;
    private int minQuantity;

    // Constructors
    public CartItem() {}

    public CartItem(String itemId, String name, String imageUrl, double price,
                    int quantity, int maxQuantity, int minQuantity) {
        this.itemId = itemId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.quantity = quantity;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
    }

    // Getters
    public String getItemId() { return itemId; }
    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public int getMaxQuantity() { return maxQuantity; }
    public int getMinQuantity() { return minQuantity; }

    // Setters
    public void setItemId(String itemId) { this.itemId = itemId; }
    public void setName(String name) { this.name = name; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setPrice(double price) { this.price = price; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public void setMaxQuantity(int maxQuantity) { this.maxQuantity = maxQuantity; }
    public void setMinQuantity(int minQuantity) { this.minQuantity = minQuantity; }
}
