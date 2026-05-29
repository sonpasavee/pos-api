"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuController = void 0;
const menu_service_1 = require("../services/menu.service");
exports.menuController = {
    async getAll(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const items = await menu_service_1.menuService.getAll(restaurantId);
            res.json(items);
        }
        catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async getPublic(req, res) {
        try {
            const items = await menu_service_1.menuService.getPublic(req.params.restaurantId);
            res.json(items);
        }
        catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async create(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const item = await menu_service_1.menuService.create(restaurantId, req.body);
            res.status(201).json(item);
        }
        catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async update(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const item = await menu_service_1.menuService.update(req.params.id, restaurantId, req.body);
            res.json(item);
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async remove(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            await menu_service_1.menuService.remove(req.params.id, restaurantId);
            res.json({ success: true });
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
};
