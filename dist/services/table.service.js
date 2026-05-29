"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableService = void 0;
const db_1 = require("../lib/db");
exports.tableService = {
    async getAll(restaurantId) {
        return db_1.prisma.table.findMany({
            where: { restaurantId },
            orderBy: { number: 'asc' }
        });
    },
    async getByQrToken(qrToken) {
        const table = await db_1.prisma.table.findUnique({
            where: { qrToken },
            include: { restaurant: { select: { id: true, name: true, logoUrl: true } } },
        });
        if (!table) {
            throw new Error('NOT_FOUND');
        }
        return table;
    },
    async create(restaurantId, number) {
        const existing = await db_1.prisma.table.findUnique({
            where: { restaurantId_number: { restaurantId, number } }
        });
        if (existing) {
            throw new Error('TABLE_EXISTS');
        }
        return await db_1.prisma.table.create({
            data: { number, restaurantId }
        });
    },
    async remove(id, restaurantId) {
        const table = await db_1.prisma.table.findFirst({
            where: { id, restaurantId }
        });
        if (!table) {
            throw new Error('NOT_FOUND');
        }
        await db_1.prisma.table.delete({
            where: { id }
        });
        return { message: 'DELETED' };
    }
};
