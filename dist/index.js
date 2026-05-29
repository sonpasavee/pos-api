"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv/config");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const app = (0, app_1.createApp)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || '*' },
});
exports.io.on('connection', (socket) => {
    socket.on('join:restaurant', (restaurantId) => {
        socket.join(`restaurant:${restaurantId}`);
    });
});
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running → http://localhost:${PORT}`);
});
