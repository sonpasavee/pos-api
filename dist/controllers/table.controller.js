"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableController = void 0;
const table_service_1 = require("../services/table.service");
exports.tableController = {
    async getAll(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const tables = await table_service_1.tableService.getAll(restaurantId);
            res.json(tables);
        }
        catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async getByQrToken(req, res) {
        try {
            const table = await table_service_1.tableService.getByQrToken(req.params.token);
            res.json(table);
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async create(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            const table = await table_service_1.tableService.create(restaurantId, req.body.number);
            res.status(201).json(table);
        }
        catch (err) {
            if (err.message === 'TABLE_EXISTS')
                return res.status(409).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async remove(req, res) {
        try {
            const restaurantId = req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(401).json({ error: 'UNAUTHORIZED' });
            }
            await table_service_1.tableService.remove(req.params.id, restaurantId);
            res.json({ success: true });
        }
        catch (err) {
            if (err.message === 'NOT_FOUND')
                return res.status(404).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
};
