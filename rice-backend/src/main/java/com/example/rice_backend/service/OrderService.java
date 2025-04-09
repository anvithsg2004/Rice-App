package com.example.rice_backend.service;

import com.example.rice_backend.entity.Order;
import com.example.rice_backend.entity.OrderItem;
import com.example.rice_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        // Generate a unique order ID
        order.setId(UUID.randomUUID().toString());
        // Set the order date
        order.setDate(new Date());
        // Set default status to "processing"
        order.setStatus("processing");
        // Calculate total and total weight
        calculateTotals(order);
        // Save the order
        return orderRepository.save(order);
    }

    private void calculateTotals(Order order) {
        List<OrderItem> items = order.getItems();
        double total = items.stream()
                .mapToDouble(item -> item.getPrice())
                .sum();
        double totalWeight = items.stream()
                .mapToDouble(OrderItem::getWeight) // Directly sum weights
                .sum();

        order.setTotal(total);
        order.setTotalWeight(totalWeight);
    }

    public List<Order> getAllOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
