package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Objects;

@Document(collection = "rice_items")
public class RiceItem {
    @Id
    private String id;
    private String name;
    private String type; // This will act as the category
    private String imageUrl;
    private double quantity; // In kg
    private double originalPrice;
    private double discount;
    private double finalPrice;
    private String description;
    private List<String> nutrients;
    private int maxQuantity = 10;  // Default max quantity
    private int minQuantity = 1;   // Default min quantity

    // No-args constructor
    public RiceItem() {
    }

    // All-args constructor
    public RiceItem(String id, String name, String type, String imageUrl, double quantity,
                    double originalPrice, double discount, double finalPrice,
                    String description, List<String> nutrients,
                    int maxQuantity, int minQuantity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.finalPrice = finalPrice;
        this.description = description;
        this.nutrients = nutrients;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
    }

    public int getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(int maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public int getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(int minQuantity) {
        this.minQuantity = minQuantity;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getNutrients() {
        return nutrients;
    }

    public void setNutrients(List<String> nutrients) {
        this.nutrients = nutrients;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RiceItem riceItem = (RiceItem) o;
        return Objects.equals(id, riceItem.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
