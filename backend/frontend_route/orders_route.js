// routes/orderRoutes.js
const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById,
    deleteOrder,
    updateOrderStatus,
    getShipmentStatus,
    trackShipment,
    updatePaymentStatus
} = require('../fronted_controller/orders_contrller');
const { authenticationVerifier } = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/create', authenticationVerifier, createOrder);
router.put('/:id/payment-status',authenticationVerifier, updatePaymentStatus);
router.get('/', authenticationVerifier, getOrders);
router.get('/:id', authenticationVerifier, getOrderById);
router.delete('/:id', deleteOrder);
router.put('/:id/status', updateOrderStatus);


router.get('/shipments/:trackingNumber/track', trackShipment);
router.get('/shipments/:trackingNumber/status', getShipmentStatus);
module.exports = router;
