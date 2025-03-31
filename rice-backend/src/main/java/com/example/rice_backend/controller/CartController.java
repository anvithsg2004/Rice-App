package com.example.rice_backend.controller;

import com.example.rice_backend.entity.Cart;
import com.example.rice_backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/{userId}/add/{riceItemId}")
    public ResponseEntity<Cart> addToCart(@PathVariable String userId, @PathVariable String riceItemId,
                                          @RequestParam int quantity) {
        Cart updatedCart = cartService.addToCart(userId, riceItemId, quantity);
        return new ResponseEntity<>(updatedCart, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }
}
