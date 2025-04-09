package com.example.rice_backend.service;

import com.example.rice_backend.entity.Cart;
import com.example.rice_backend.entity.CartItem;
import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.repository.CartRepository;
import com.example.rice_backend.repository.RiceItemRepository;
import com.example.rice_backend.utility.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// CartService.java
@Service
public class CartService {
    private final CartRepository cartRepository;
    private final RiceItemRepository riceItemRepository;

    public CartService(CartRepository cartRepository, RiceItemRepository riceItemRepository) {
        this.cartRepository = cartRepository;
        this.riceItemRepository = riceItemRepository;
    }

    public Cart addToCart(String riceItemId, int quantityDelta) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        RiceItem riceItem = riceItemRepository.findById(riceItemId)
                .orElseThrow(() -> new RuntimeException("Rice item not found"));

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> new Cart(userEmail, new ArrayList<>()));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getItemId().equals(riceItemId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantityDelta;

            // Validate against cart item's original limits
            if (newQuantity < item.getMinQuantity()) {
                throw new RuntimeException(
                        String.format("Minimum quantity is %d", item.getMinQuantity())
                );
            }
            if (newQuantity > item.getMaxQuantity()) {
                throw new RuntimeException(
                        String.format("Maximum quantity is %d", item.getMaxQuantity())
                );
            }

            item.setQuantity(newQuantity);
        } else {
            // Validate against rice item's current limits for new items
            if (quantityDelta < riceItem.getMinQuantity()) {
                throw new RuntimeException(
                        String.format("Minimum quantity is %d", riceItem.getMinQuantity())
                );
            }
            if (quantityDelta > riceItem.getMaxQuantity()) {
                throw new RuntimeException(
                        String.format("Maximum quantity is %d", riceItem.getMaxQuantity())
                );
            }

            cart.getItems().add(new CartItem(
                    riceItem.getId(),
                    riceItem.getName(),
                    riceItem.getImageUrl(),
                    riceItem.getFinalPrice(),
                    quantityDelta,
                    riceItem.getMaxQuantity(),
                    riceItem.getMinQuantity()
            ));
        }

        calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    public Cart applyPromo(String promoCode) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        double discount = 0;
        if (promoCode.equalsIgnoreCase("RICESALE")) {
            discount = cart.getSubtotal() * 0.1; // 10% off subtotal
        } else if (promoCode.equalsIgnoreCase("RICESHIP")) {
            discount = cart.getShipping(); // Free shipping
        } else {
            throw new RuntimeException("Invalid promo code");
        }

        cart.setDiscount(discount);
        calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    private void calculateCartTotals(Cart cart) {
        double subtotal = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        double shipping = subtotal > 1000 ? 0 : 50;
        double tax = subtotal * 0.05;
        double total = subtotal + shipping + tax - cart.getDiscount();

        cart.setSubtotal(subtotal);
        cart.setShipping(shipping);
        cart.setTax(tax);
        cart.setTotal(total);
    }

    public Cart getCartByUserEmail() {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        return cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> new Cart(userEmail, new ArrayList<>()));
    }

    public Cart removeFromCart(String itemId) {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Remove item if exists
        boolean removed = cart.getItems().removeIf(item -> item.getItemId().equals(itemId));

        if (!removed) {
            throw new RuntimeException("Item not found in cart");
        }

        calculateCartTotals(cart);
        return cartRepository.save(cart);
    }

    public void clearCart() {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElse(null); // Return null if the cart does not exist

        if (cart != null && !cart.getItems().isEmpty()) {
            // Clear all items in the cart
            cart.setItems(new ArrayList<>());
            // Recalculate cart totals
            calculateCartTotals(cart);
            // Save the updated cart
            cartRepository.save(cart);
        }
        // If the cart does not exist or is already empty, do nothing
    }
}
