"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    tableId: zod_1.z.string().cuid(),
    note: zod_1.z.string().max(300).optional(),
    lineUserId: zod_1.z.string().optional(), // เพิ่ม
    lineName: zod_1.z.string().optional(), // เพิ่ม
    items: zod_1.z.array(zod_1.z.object({
        menuItemId: zod_1.z.string().cuid(),
        quantity: zod_1.z.number().int().min(1).max(99),
    })).min(1),
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"])
});
