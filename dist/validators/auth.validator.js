"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineAuthSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    restaurantName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(2),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.lineAuthSchema = zod_1.z.object({
    accessToken: zod_1.z.string().min(1),
});
