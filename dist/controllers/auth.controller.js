"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
const db_1 = require("../lib/db");
exports.authController = {
    async register(req, res) {
        try {
            const result = await auth_service_1.authService.register(req.body);
            return res.json(result);
        }
        catch (err) {
            if (err.message === 'EMAIL_TAKEN')
                return res.status(409).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async login(req, res) {
        try {
            const result = await auth_service_1.authService.login(req.body.email, req.body.password);
            return res.json(result);
        }
        catch (err) {
            if (err.message === 'USER_NOT_FOUND' || err.message === 'INVALID_PASSWORD')
                return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async me(req, res) {
        try {
            const user = await db_1.prisma.user.findUnique({
                where: { id: req.user.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    restaurantId: true,
                },
            });
            res.json(user);
        }
        catch {
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
    async lineAuth(req, res) {
        try {
            const result = await auth_service_1.authService.lineAuth(req.body.accessToken);
            res.json(result);
        }
        catch (err) {
            if (err.message === 'LINE_AUTH_FAILED')
                return res.status(401).json({ error: err.message });
            res.status(500).json({ error: 'INTERNAL_ERROR' });
        }
    },
};
