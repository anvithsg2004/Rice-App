package com.example.rice_backend.controller;

import com.example.rice_backend.entity.Cart;
import com.example.rice_backend.entity.Order;
import com.example.rice_backend.repository.CartRepository;
import com.example.rice_backend.service.*;
import com.example.rice_backend.utility.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private CartService cartService;
    @Autowired
    private CheckoutService checkoutService;
    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createRazorpayOrder() {
        try {
            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            Cart cart = cartService.getCartByUserEmail();
            if (cart.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty"));
            }

            // Reset previous order details
            cart.setRazorpayOrderId(null);
            cart.setRazorpayOrderAmount(0);
            cart.setVersion(cart.getVersion() + 1);
            cartRepository.save(cart);

            // Validate total amount
            double totalAmount = cart.getTotal();
            if (totalAmount <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid cart total amount"));
            }

            String razorpayOrderId = paymentService.createOrder(totalAmount);

            cart.setRazorpayOrderId(razorpayOrderId);
            cart.setRazorpayOrderAmount(totalAmount);
            cartRepository.save(cart);

            return ResponseEntity.ok(Map.of(
                    "orderId", razorpayOrderId,
                    "amount", totalAmount,
                    "currency", "INR",
                    "key", paymentService.getRazorpayKeyId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData) {
        try {
            System.out.println("\n=== Payment Verification Request ===");
            System.out.println("Received paymentData: " + paymentData);

            String userEmail = SecurityUtils.getCurrentUserEmail();
            if (userEmail == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String paymentId = paymentData.get("paymentId");
            String razorpayOrderId = paymentData.get("razorpayOrderId");
            String signature = paymentData.get("signature");

            System.out.println("Received paymentId: " + paymentId);
            System.out.println("Received razorpayOrderId: " + razorpayOrderId);
            System.out.println("Received signature: " + signature);

            Cart cart = cartService.getCartByUserEmail();
            System.out.println("Cart order ID: " + cart.getRazorpayOrderId());
            System.out.println("Cart expected amount: " + cart.getRazorpayOrderAmount());

            // Validate cart state
            if (cart.getRazorpayOrderId() == null || cart.getRazorpayOrderAmount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cart not ready for payment"));
            }

            if (!razorpayOrderId.equals(cart.getRazorpayOrderId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid order ID"));
            }

            boolean isValid = paymentService.verifyPayment(
                    paymentId,
                    razorpayOrderId,
                    signature,
                    cart.getRazorpayOrderAmount()
            );

            if (!isValid) {
                return ResponseEntity.badRequest().body(Map.of("message", "Payment verification failed"));
            }

            // Process checkout only after successful verification
            Order createdOrder = checkoutService.processCheckout();

            // Clear payment details from cart
            cart.setRazorpayOrderId(null);
            cart.setRazorpayOrderAmount(0);
            cartRepository.save(cart);

            //Clearing the cart explicitly with another method in the cart service.
            cartService.clearCart();

            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful",
                    "order", createdOrder
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Payment verification error: " + e.getMessage()));
        }
    }
}
