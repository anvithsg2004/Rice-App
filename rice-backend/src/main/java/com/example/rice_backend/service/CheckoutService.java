package com.example.rice_backend.service;

import com.example.rice_backend.entity.*;
import com.example.rice_backend.repository.CartRepository;
import com.example.rice_backend.repository.RiceItemRepository;
import com.example.rice_backend.utility.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CheckoutService {
    private final CartRepository cartRepository;
    private final RiceItemRepository riceItemRepository;
    private final OrderService orderService;

    @Autowired
    public CheckoutService(CartRepository cartRepository,
                           RiceItemRepository riceItemRepository,
                           OrderService orderService) {
        this.cartRepository = cartRepository;
        this.riceItemRepository = riceItemRepository;
        this.orderService = orderService;
    }

    //@Transactional
    public Order processCheckout() {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Create order from cart items
        Order order = new Order();
        order.setUserId(userEmail);
        order.setStatus("ordered");
        order.setDate(new Date());

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> new OrderItem(
                        cartItem.getItemId(),
                        cartItem.getName(),
                        cartItem.getQuantity(),
                        cartItem.getPrice(),
                        cartItem.getQuantity()
                ))
                .collect(Collectors.toList());
        order.setItems(orderItems);
        order.setTotal(cart.getTotal());

        // Save order
        Order createdOrder = orderService.createOrder(order);

        // Update product quantities
        for (CartItem cartItem : cart.getItems()) {
            RiceItem riceItem = riceItemRepository.findById(cartItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("Rice item not found: " + cartItem.getItemId()));
            int newQuantity = (int) (riceItem.getQuantity() - cartItem.getQuantity());
            if (newQuantity < 0) {
                throw new RuntimeException("Insufficient stock for " + riceItem.getName());
            }
            riceItem.setQuantity(newQuantity);
            riceItemRepository.save(riceItem);
        }

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return createdOrder;
    }
}
