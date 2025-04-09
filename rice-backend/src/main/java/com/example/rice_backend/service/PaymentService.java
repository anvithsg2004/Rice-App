package com.example.rice_backend.service;

import com.example.rice_backend.utility.HmacSHA256;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Autowired
    private RazorpayClient razorpayClient;

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public String createOrder(double amount) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1);

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        return razorpayOrder.get("id");
    }

    public boolean verifyPayment(String paymentId, String orderId, String signature, double expectedAmount) {
        try {
            System.out.println("\n=== Verification Process ===");
            System.out.println("Payment ID: " + paymentId);
            System.out.println("Order ID: " + orderId);
            System.out.println("Received Signature: " + signature);
            System.out.println("Expected Amount: " + expectedAmount);

            String generatedSignature = HmacSHA256.generateSignature(orderId + "|" + paymentId, razorpayKeySecret);
            System.out.println("Generated Signature: " + generatedSignature);

            Order razorpayOrder = razorpayClient.orders.fetch(orderId);
            double actualAmount = ((Integer) razorpayOrder.get("amount")) / 100.0;
            System.out.println("Razorpay Amount: " + actualAmount);
            System.out.println("Amount Match: " + (Math.abs(actualAmount - expectedAmount) < 0.01));

            boolean signatureValid = generatedSignature.equals(signature);
            boolean amountValid = Math.abs(actualAmount - expectedAmount) < 0.01;

            System.out.println("Signature Valid: " + signatureValid);
            System.out.println("Amount Valid: " + amountValid);

            return signatureValid && amountValid;
        } catch (RazorpayException e) {
            System.out.println("Razorpay Exception: " + e.getMessage());
            throw new RuntimeException("Error verifying payment", e);
        }
    }

    public String getRazorpayKeyId() {
        return razorpayKeyId;
    }
}
