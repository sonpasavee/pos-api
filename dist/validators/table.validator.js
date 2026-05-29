"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTableSchema = void 0;
const zod_1 = require("zod");
exports.createTableSchema = zod_1.z.object({
    number: zod_1.z.number().int().positive(),
});
