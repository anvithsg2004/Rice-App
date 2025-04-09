import hmac
import hashlib

key_secret = "h5vuHVjRxL55H5Whobak7qKi"  # Your Razorpay key secret
order_id = "order_QG9d8c9lb0elkG"        # From your create-order API response
payment_id = "pay_100000000000001"       # Test ID for success

message = f"{order_id}|{payment_id}"
signature = hmac.new(
    key_secret.encode(),
    message.encode(),
    hashlib.sha256
).hexdigest()

print("Signature:", signature)  # Use this in Postman