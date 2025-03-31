package com.example.rice_backend.controller;

import com.example.rice_backend.entity.Order;
import com.example.rice_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getAllOrdersByUserId(@PathVariable String userId) {
        List<Order> orders = orderService.getAllOrdersByUserId(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getAllOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getAllOrdersByStatus(status);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
}
