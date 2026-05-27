"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const node_util_1 = require("node:util");
const jose_1 = require("jose");
const secret = new node_util_1.TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
async function signJwt(payload, expiresIn = "7d") {
    return new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret);
}
async function verifyJwt(token) {
    const { payload } = await (0, jose_1.jwtVerify)(token, secret);
    return payload;
}
