package com.example.rice_backend.service;

import com.example.rice_backend.entity.Cart;
import com.example.rice_backend.entity.CartItem;
import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.repository.CartRepository;
import com.example.rice_backend.repository.RiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private RiceItemRepository riceItemRepository;

    public Cart addToCart(String userId, String riceItemId, int quantity) {
        // Find the cart by user ID
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
            cart.setItems(List.of());
        }

        // Find the rice item by ID
        RiceItem riceItem = riceItemRepository.findById(riceItemId)
                .orElseThrow(() -> new RuntimeException("Rice item not found"));

        // Create a cart item
        CartItem cartItem = new CartItem();
        cartItem.setItemId(riceItem.getId());
        cartItem.setName(riceItem.getName());
        cartItem.setImageUrl(riceItem.getImageUrl());
        cartItem.setPrice(riceItem.getFinalPrice());
        cartItem.setQuantity(quantity);
        cartItem.setMaxQuantity(10); // Set your max quantity logic
        cartItem.setMinQuantity(1);  // Set your min quantity logic

        // Add the cart item to the cart
        List<CartItem> items = cart.getItems();
        items.add(cartItem);
        cart.setItems(items);

        // Calculate totals
        calculateTotals(cart);

        // Save the cart
        return cartRepository.save(cart);
    }

    private void calculateTotals(Cart cart) {
        List<CartItem> items = cart.getItems();
        double subtotal = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setSubtotal(subtotal);
        cart.setShipping(subtotal > 1000 ? 0 : 50); // Example shipping logic
        cart.setTax(subtotal * 0.05); // Example tax logic
        cart.setDiscount(0); // Example discount logic
        cart.setTotal(subtotal + cart.getShipping() + cart.getTax() - cart.getDiscount());
    }

    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId);
    }
}
