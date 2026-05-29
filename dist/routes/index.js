"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const menu_routes_1 = __importDefault(require("./menu.routes"));
const order_routes_1 = __importDefault(require("./order.routes"));
const table_routes_1 = __importDefault(require("./table.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/menu', menu_routes_1.default);
router.use('/tables', table_routes_1.default);
router.use('/orders', order_routes_1.default);
exports.default = router;
