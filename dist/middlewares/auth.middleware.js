"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../lib/jwt");
async function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        req.user = await (0, jwt_1.verifyToken)(auth.split(' ')[1]);
        next();
    }
    catch {
        res.status(401).json({ message: 'INVALID_TOKEN' });
    }
}
