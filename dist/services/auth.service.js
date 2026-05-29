"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../lib/db");
const jwt_1 = require("../lib/jwt");
exports.authService = {
    async register(data) {
        const existing = await db_1.prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existing) {
            throw new Error('EMAIL_TAKEN');
        }
        const slug = data.restaurantName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '') +
            '-' +
            Date.now();
        const restaurant = await db_1.prisma.restaurant.create({
            data: { name: data.restaurantName, slug },
        });
        const user = await db_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: await bcryptjs_1.default.hash(data.password, 10),
                name: data.name,
                role: 'OWNER',
                restaurantId: restaurant.id
            },
        });
        const token = await (0, jwt_1.signToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                restaurantId: user.restaurantId
            },
        };
    },
    async login(email, password) {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
            include: {
                restaurant: true
            }
        });
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid) {
            throw new Error('INVALID_PASSWORD');
        }
        const token = await (0, jwt_1.signToken)({
            userId: user.id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
        });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                restaurantId: user.restaurantId
            }
        };
    },
    async lineAuth(accessToken) {
        const lineRes = await fetch('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!lineRes.ok) {
            throw new Error('LINE_AUTH_FAILED');
        }
        const lineProfile = await lineRes.json();
        // upsert customer — มีแล้วอัปเดต ไม่มีสร้างใหม่
        const customer = await db_1.prisma.customer.upsert({
            where: { lineUserId: lineProfile.userId },
            update: {
                displayName: lineProfile.displayName,
                pictureUrl: lineProfile.pictureUrl,
            },
            create: {
                lineUserId: lineProfile.userId,
                displayName: lineProfile.displayName,
                pictureUrl: lineProfile.pictureUrl,
            },
        });
        // sign JWT ของเราเอง (แยกจาก staff)
        const token = await (0, jwt_1.signToken)({
            userId: customer.id,
            lineUserId: customer.lineUserId,
            displayName: customer.displayName,
            role: 'CUSTOMER',
        });
        return { token, customer };
    },
};
