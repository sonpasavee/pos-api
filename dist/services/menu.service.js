"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuService = void 0;
const db_1 = require("../lib/db");
exports.menuService = {
    async getAll(restaurantId) {
        return db_1.prisma.menuItem.findMany({
            where: { restaurantId },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    },
    async getPublic(restaurantId) {
        return db_1.prisma.menuItem.findMany({
            where: { restaurantId, available: true },
            orderBy: [{ category: 'asc' }, { name: 'asc' }],
        });
    },
    async create(restaurantId, data) {
        return db_1.prisma.menuItem.create({
            data: { ...data, restaurantId },
        });
    },
    async update(id, restaurantId, data) {
        const item = await db_1.prisma.menuItem.findFirst({
            where: { id, restaurantId }
        });
        if (!item) {
            throw new Error('NOT_FOUND');
        }
        return db_1.prisma.menuItem.update({
            where: { id },
            data,
        });
    },
    async remove(id, restaurantId) {
        const item = await db_1.prisma.menuItem.findFirst({
            where: { id, restaurantId },
        });
        if (!item) {
            throw new Error('NOT_FOUND');
        }
        return db_1.prisma.menuItem.delete({
            where: { id },
        });
    }
};
