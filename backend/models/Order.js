const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User" 
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Product" 
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        amount: {
            type: Number,
            required: true 
        },
        address: {
                    type: Object,
                    required: true
                },
        country: {
            type: String,
            required: true, 
            enum: ["PAK", "IN", "US", "default"], 
            default: "default"
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["cod", "credit_card", "paypal"] 
        },
        paymentStatus: {
            type: String,
            default: "pending",
            enum: ["pending", "paid", "failed"] 
        },
        transactionId: {
            type: String 
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "processing", "completed", "cancelled"] 
        },
        trackingNumber: {
            type: String 
        },
        shippingStatus: {
            type: String,
            default: "pending", 
            enum: ["pending", "booked", "shipped", "delivered", "cancelled"] 
        }
    },
    { timestamps: true } 
);

module.exports = mongoose.model('Order', OrderSchema);
