"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const db_1 = require("../lib/db");
const orderInclude = {
    items: { include: { menuItem: true } },
    table: true,
    payment: true
};
exports.orderService = {
    async getAll(restaurantId, status) {
        return db_1.prisma.order.findMany({
            where: {
                table: { restaurantId },
                ...(status ? { status: status } : {})
            },
            include: orderInclude,
            orderBy: { createdAt: 'desc' }
        });
    },
    async getById(id, restaurantId) {
        const order = await db_1.prisma.order.findFirst({
            where: { id, table: { restaurantId } },
            include: orderInclude,
        });
        if (!order) {
            throw new Error('NOT_FOUND');
        }
        return order;
    },
    async create(input, customerId) {
        const menuItems = await db_1.prisma.menuItem.findMany({
            where: {
                id: { in: input.items.map((i) => i.menuItemId) },
                available: true
            },
        });
        if (menuItems.length !== input.items.length) {
            throw new Error('MENU_ITEM_UNAVAILABLE');
        }
        const total = input.items.reduce((sum, item) => {
            const menu = menuItems.find((m) => m.id === item.menuItemId);
            return sum + Number(menu.price) * item.quantity;
        }, 0);
        return db_1.prisma.order.create({
            data: {
                tableId: input.tableId,
                note: input.note,
                total,
                customerId,
                items: {
                    create: input.items.map((item) => {
                        const menu = menuItems.find((m) => m.id === item.menuItemId);
                        return {
                            menuItemId: item.menuItemId,
                            quantity: item.quantity,
                            price: menu.price,
                        };
                    }),
                },
            },
            include: orderInclude,
        });
    },
    async updateStatus(id, restaurantId, input) {
        const existing = await db_1.prisma.order.findFirst({
            where: { id, table: { restaurantId } }
        });
        if (!existing) {
            throw new Error('NOT_FOUND');
        }
        return db_1.prisma.order.update({
            where: { id },
            data: { status: input.status },
            include: orderInclude,
        });
    },
    async cancle(id, restaurantId) {
        const existing = await db_1.prisma.order.findFirst({
            where: { id, table: { restaurantId } }
        });
        if (!existing) {
            throw new Error('NOT_FOUND');
        }
        if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
            throw new Error('CANNOT_CANCEL_COMPLETED_OR_CANCELLED_ORDER');
        }
        return db_1.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: orderInclude,
        });
    },
};
