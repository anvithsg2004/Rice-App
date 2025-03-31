package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "rice_items")
public class RiceItem {
    @Id
    private String id;
    private String name;
    private String type; // This will act as the category
    private String imageUrl;
    private double quantity;
    private double originalPrice;
    private double discount;
    private double finalPrice;
    private boolean inStock;
    private int sold;
    private List<String> nutrients;

    // No-args constructor
    public RiceItem() {
    }

    // All-args constructor
    public RiceItem(String id, String name, String type, String imageUrl, double quantity,
                    double originalPrice, double discount, double finalPrice, boolean inStock,
                    int sold, List<String> nutrients) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.finalPrice = finalPrice;
        this.inStock = inStock;
        this.sold = sold;
        this.nutrients = nutrients;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public boolean isInStock() {
        return inStock;
    }

    public void setInStock(boolean inStock) {
        this.inStock = inStock;
    }

    public int getSold() {
        return sold;
    }

    public void setSold(int sold) {
        this.sold = sold;
    }

    public List<String> getNutrients() {
        return nutrients;
    }

    public void setNutrients(List<String> nutrients) {
        this.nutrients = nutrients;
    }
}
