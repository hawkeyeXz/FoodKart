import express from 'express';
import {createOrder, getUserOrders, getOrderById, cancelOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:id', getOrderById);
router.put('/cancel/:id', cancelOrder);

export default router;
