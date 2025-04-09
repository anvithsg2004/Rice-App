package com.example.rice_backend.controller;

import com.example.rice_backend.entity.Order;
import com.example.rice_backend.service.OrderService;
import com.example.rice_backend.service.UserService;
import com.example.rice_backend.utility.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/my-orders")
    public ResponseEntity<?> getOrdersForCurrentUser() {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            System.out.println("Email : " + userEmail);
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            List<Order> orders = orderService.getAllOrdersByUserId(userEmail);
            System.out.println(orders.toString());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching orders"));
        }
    }

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
