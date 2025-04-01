package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String name; // This will be the type of rice
    private List<RiceItem> riceItems; // List of RiceItem objects

    // No-args constructor
    public Category() {
        this.riceItems = new ArrayList<>();
    }

    // All-args constructor
    public Category(String id, String name, List<RiceItem> riceItems) {
        this.id = id;
        this.name = name;
        this.riceItems = riceItems;
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

    public List<RiceItem> getRiceItems() {
        return riceItems;
    }

    public void setRiceItems(List<RiceItem> riceItems) {
        this.riceItems = riceItems;
    }
}
