package com.example.rice_backend.controller;

import com.example.rice_backend.entity.Cart;
import com.example.rice_backend.entity.Order;
import com.example.rice_backend.entity.RiceItem;
import com.example.rice_backend.service.CartService;
import com.example.rice_backend.service.CheckoutService;
import com.example.rice_backend.utility.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping("/add/{riceItemId}")
    public ResponseEntity<?> addToCart(@PathVariable String riceItemId,
                                       @RequestParam int quantity) {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Cart updatedCart = cartService.addToCart(riceItemId, quantity);
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            // Return the error message to frontend
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        String userEmail = SecurityUtils.getCurrentUserEmail();
        if (userEmail == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Cart cart = cartService.getCartByUserEmail();
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable String itemId) {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Cart updatedCart = cartService.removeFromCart(itemId);
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }

    @PostMapping("/apply-promo")
    public ResponseEntity<?> applyPromo(@RequestParam String promoCode) {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Cart updatedCart = cartService.applyPromo(promoCode);
            return ResponseEntity.ok(updatedCart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout() {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Order createdOrder = checkoutService.processCheckout();
            return ResponseEntity.ok(Map.of(
                    "message", "Checkout successful",
                    "order", createdOrder
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );
        }
    }
}
