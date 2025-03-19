// controllers/adminController.js
const { saveImages } = require('../helpers/fileUploadHelper');
const { paginate, configurePagination } = require('../helpers/pagninateHelper');
const Order = require('../models/Order');
const ApiResponse = require('../response/ApiResponse');
const ErrorRespnse = require('../response/error_response');

const sonicShippingService = require('../shippgin/shippingcontroller');


// Update a product
exports.updateOrder = async (req, res) => {
    try {
        if (req.params.id === undefined) {
            return res.status(400).json(new ErrorRespnse(400, 'Order id is required'));
        }
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json(new ErrorRespnse(404, 'Order not found'));


        const updatedProduct = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(new ApiResponse(200, 'Order updated successfully', updatedProduct));
    } catch (error) {
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};

// Get all products


exports.getAllOrders = async (req, res) => {
    try {
        // const products = await Product.find();
        const query = {
            deletedAt: null,

        }

        // const orders = await Order.find(query).populate('userId');
        const options = configurePagination(req, query, ['products.name', 'userId.name']);
        options.populate = [
            { path: 'userId' }, // Populate userId
            { path: 'products.productId' } // Populate productId inside the products array
        ];

        const orders = await paginate(Order, options);
        res.status(200).json(new ApiResponse(200, 'order fetched successfully', orders));
    } catch (error) {
        // res.status(500).json({ error: error });
        console.log('error', error);
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};

// Get a single product
exports.getOrderDetails = async (req, res) => {
    try {
        if (req.params.id === undefined) {
            return res.status(400).json(new ErrorRespnse(400, 'Product id is required'));
        }
        const populate = [
            { path: 'userId' }, // Populate the 'userId' field
            { path: 'products.productId' } // Populate the 'productId' inside the 'products' array
        ];

        // Fetch the order, ensuring the 'populate' function works as expected
        const order = await Order.findById(req.params.id)
            .populate(populate).lean();

        // call shipping service with tracking number
        const trackingInfo = await sonicShippingService.getShipmentStatus(order.trackingNumber);

        console.log('trackingInfo', trackingInfo);

        // Update the order with the tracking information
        order.trackingInfo = trackingInfo;

        console.log('order details', order);
        if (!order) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(new ApiResponse(200, 'Product fetched successfully', order));
    } catch (error) {
        console.log('error', error);
        res.status(500).json(new ErrorRespnse(500, 'Something went wrong please try again', error));
    }
};


// Add new endpoint to track shipment
exports.trackShipment = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const trackingInfo = await sonicShippingService.trackShipment(trackingNumber);
        res.status(200).json(new ApiResponse(200, 'Tracking information retrieved successfully', trackingInfo));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, 'Error tracking shipment', error));
    }
};

// Add new endpoint to get shipment status
exports.getShipmentStatus = async (req, res) => {
    const { trackingNumber } = req.params;

    try {
        const statusInfo = await sonicShippingService.getShipmentStatus(trackingNumber);
        res.status(200).json(new ApiResponse(200, 'Status retrieved successfully', statusInfo));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, 'Error getting shipment status', error));
    }
};