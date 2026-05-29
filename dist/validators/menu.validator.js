"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemSchema = exports.createMenuItemSchema = void 0;
const zod_1 = require("zod");
exports.createMenuItemSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    category: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    imageUrl: zod_1.z.string().url().optional(),
    available: zod_1.z.boolean().default(true),
});
exports.updateMenuItemSchema = exports.createMenuItemSchema.partial();
