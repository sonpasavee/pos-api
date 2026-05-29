"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
// public - customer สั่งผ่าน QR
router.post('/', (0, validate_middleware_1.validate)(order_validator_1.createOrderSchema), order_controller_1.orderController.create);
router.get('/', auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)('OWNER', 'STAFF'), order_controller_1.orderController.getAll);
router.get('/:id', auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)('OWNER', 'STAFF'), order_controller_1.orderController.getById);
router.patch('/:id/status', auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)('OWNER', 'STAFF'), (0, validate_middleware_1.validate)(order_validator_1.updateStatusSchema), order_controller_1.orderController.updateStatus);
router.patch('/:id/cancel', auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)('OWNER', 'STAFF'), order_controller_1.orderController.cancle);
exports.default = router;
