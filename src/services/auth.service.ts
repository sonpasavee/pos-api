import bcrypt from 'bcryptjs'
import { prisma } from '../lib/db'
import { signToken } from '../lib/jwt'
import { loginSchema } from '../validators/auth.validator'


export const authService = {
    async register(data: {
        restaurantName: string
        email: string
        password: string
        name: string
    }) {
        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existing) {
            throw new Error('EMAIL_TAKEN')
        }

        const slug =
            data.restaurantName
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '') +
            '-' +
            Date.now()

        const restaurant = await prisma.restaurant.create({
            data: { name: data.restaurantName, slug },
        })

        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: await bcrypt.hash(data.password, 10),
                name: data.name,
                role: 'OWNER',
                restaurantId: restaurant.id
            },
        })

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
        })

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                restaurantId: user.restaurantId
            },
        }
    },

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                restaurant: true
            }
        })

        if (!user) {
            throw new Error('USER_NOT_FOUND')
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            throw new Error('INVALID_PASSWORD')
        }

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId
        })

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                restaurantId: user.restaurantId
            }
        }
    }
}