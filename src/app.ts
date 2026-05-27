import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
// import routes from './routes'

export function createApp() {
    const app = express()
    app.use(cors({
        origin: process.env.FRONTEND_URL || '*',
    }))
    app.use(helmet())
    app.use(express.json())
    app.use(morgan('dev'))
    // app.use(routes)

    app.get('health', (req, res) => {
        res.json({ status: 'OK' })
    })

    return app
}

