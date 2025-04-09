package com.example.rice_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", date=" + date +
                ", status='" + status + '\'' +
                ", items=" + items +
                ", total=" + total +
                ", totalWeight=" + totalWeight +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                '}';
    }

    @Field("userId") // Ensure proper MongoDB field mapping
    private String userId;
    private Date date;
    private String status;
    private List<OrderItem> items;
    private double total;
    private double totalWeight;
    private String paymentMethod;
    private String deliveryAddress;

    // No-Arg Constructor
    public Order() {
    }

    // All-Arg Constructor
    public Order(String id, String userId, Date date, String status, List<OrderItem> items, double total, double totalWeight, String paymentMethod, String deliveryAddress) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.status = status;
        this.items = items;
        this.total = total;
        this.totalWeight = totalWeight;
        this.paymentMethod = paymentMethod;
        this.deliveryAddress = deliveryAddress;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public Date getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public double getTotal() {
        return total;
    }

    public double getTotalWeight() {
        return totalWeight;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
