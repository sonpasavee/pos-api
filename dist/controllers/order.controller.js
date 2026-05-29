"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("../services/order.service");
const index_1 = require("../index");
exports.orderController = {
    async getAll(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const orders = await order_service_1.orderService.getAll(restaurantId, req.query.status);
            return res.json(orders);
        }
        catch (err) {
            return res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async getById(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const order = await order_service_1.orderService.getById(req.params.id, restaurantId);
            res.json(order);
        }
        catch (err) {
            return res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async create(req, res) {
        try {
            const customerId = req.user?.role === 'CUSTOMER' ? req.user.userId : undefined;
            const order = await order_service_1.orderService.create(req.body, customerId);
            index_1.io.to(`restaurant:${order.table.restaurantId}`).emit('order:new', order);
            res.status(201).json(order);
        }
        catch (err) {
            if (err.message === 'MENU_ITEM_UNAVAILABLE')
                return res.status(400).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async updateStatus(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const order = await order_service_1.orderService.updateStatus(req.params.id, restaurantId, req.body);
            index_1.io.to(`restaurant:${order.table.restaurantId}`).emit('order:updated', order);
            return res.json(order);
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async cancle(req, res) {
        try {
            const restaurantId = req.user.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const order = await order_service_1.orderService.cancle(req.params.id, restaurantId);
            index_1.io.to(`restaurant:${order.table.restaurantId}`).emit('order:updated', order);
            res.json(order);
        }
        catch (err) {
            const clientErrors = ['NOT_FOUND', 'CANNOT_CANCEL'];
            if (clientErrors.includes(err.message))
                return res.status(400).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
};
