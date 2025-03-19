// controllers/orderController.js
const { configurePagination, paginate } = require('../helpers/pagninateHelper');
const Order = require('../models/Order');
const ApiResponse = require('../response/ApiResponse');
const ErrorRespnse = require('../response/error_response');
const sonicShippingService = require('../shippgin/shippingcontroller');

const createOrder = async (req, res) => {
    const { products, amount, address, paymentMethod, country } = req.body;
    const userId = req.user.id;

    // Validation
    if (!userId) {
        return res.status(400).json(new ErrorRespnse(400, 'User ID is required'));
    }
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json(new ErrorRespnse(400, 'Products array is required and should contain at least one product'));
    }
    if (!amount) {
        return res.status(400).json(new ErrorRespnse(400, 'Amount is required'));
    }
    if (!address) {
        return res.status(400).json(new ErrorRespnse(400, 'Address is required'));
    }
    if (!paymentMethod) {
        return res.status(400).json(new ErrorRespnse(400, 'Payment method is required'));
    }
    if (!country) {
        return res.status(400).json(new ErrorRespnse(400, 'Country is required'));
    }

    try {
        // Country-wise price adjustment
        const countryPriceAdjustment = {
            US: 1.0,
            IN: 0.8,
            UK: 1.2,
            default: 1.0,
        };
        const adjustmentFactor = countryPriceAdjustment[country] || countryPriceAdjustment.default;
        const adjustedAmount = amount * adjustmentFactor;

        // Payment status based on payment method
        const paymentStatus = paymentMethod === 'cod' ? 'pending' : 'completed';

        // Create a new order without shipment details
        const newOrder = new Order({
            userId,
            products,
            amount: adjustedAmount,
            address,
            paymentMethod,
            paymentStatus,
            country,
            status: 'pending',
        });

        const savedOrder = await newOrder.save();

        // Skip shipment and pickup related logic as it is no longer required

        res.status(201).json(new ApiResponse(201, 'Order created successfully', savedOrder));
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong. Please try again.', error));
    }
};


// Get all orders
const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const query = { deletedAt: null, userId: userId };
        const options = configurePagination(req, query);

        options.populate = [
            { path: 'userId' }, // Populate userId
            { path: 'products.productId' } // Populate productId inside the products array
        ];
        const order = await paginate(Order, options);

        res.status(200).json(new ApiResponse(200, 'Orders fetched successfully', order));
    } catch (error) {
        console.log('error', error);
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};

// Get a specific order by ID


const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        // populate = [
        //     { path: 'userId' }, // Populate userId
        //     { path: 'products.productId' } // Populate productId inside the products array
        // ];
        // const order = await Order.findById(id, { deletedAt: null }).populate(populate);
        const populate = [
            { path: 'userId' }, // Populate the 'userId' field
            { path: 'products.productId' } // Populate the 'productId' inside the 'products' array
        ];

        // Fetch the order, ensuring the 'populate' function works as expected
        const order = await Order.findById(id)
            .populate(populate);
        if (!order) {
            return res.status(404).json(new ErrorRespnse(404, 'Order not found'));
        }
        res.status(200).json(new ApiResponse(200, 'Order fetched successfully', order));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};

const trackShipment = async (req, res) => {
    const { trackingNumber } = req.params;
    try {
        const trackingInfo = await sonicShippingService.trackShipment(trackingNumber);
        res.status(200).json(new ApiResponse(200, 'Tracking information retrieved successfully', trackingInfo));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, 'Error tracking shipment', error));
    }
};

const getShipmentStatus = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const statusInfo = await sonicShippingService.getShipmentStatus(trackingNumber);
        res.status(200).json(new ApiResponse(200, 'Status retrieved successfully', statusInfo));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, 'Error getting shipment status', error));
    }
};

const updatePaymentStatus = async (req, res) => {
    const { id } = req.params; // Order ID
    const { paymentStatus, transactionId } = req.body; // Payment details

    const validPaymentStatuses = ['pending', 'paid', 'failed'];

    if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json(new ErrorRespnse(400, 'Invalid payment status'));
    }

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json(new ErrorRespnse(404, 'Order not found'));
        }

        // Update payment details
        order.paymentStatus = paymentStatus;
        if (transactionId) {
            order.transactionId = transactionId;
        }
        await order.save();

        res.status(200).json(new ApiResponse(200, 'Payment status updated successfully', order));
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json(new ErrorRespnse(500, 'Internal server error', error));
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrderStatus,
    getShipmentStatus,
    trackShipment,
    updatePaymentStatus
};