import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { createApp } from './app'

const app = createApp()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || '*' },
})

io.on('connection', (socket) => {
  socket.on('join:restaurant', (restaurantId: string) => {
    socket.join(`restaurant:${restaurantId}`)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`)
})