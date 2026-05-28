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
    },

    async lineAuth(accessToken: string) {
        const lineRes = await fetch(
            'https://api.line.me/v2/profile',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )

        if (!lineRes.ok) {
            throw new Error('LINE_AUTH_FAILED')
        }

        const lineProfile = await lineRes.json() as {
            userId: string
            displayName: string
            pictureUrl?: string
        }
        // upsert customer — มีแล้วอัปเดต ไม่มีสร้างใหม่
        const customer = await prisma.customer.upsert({
            where: { lineUserId: lineProfile.userId },
            update: {
                displayName: lineProfile.displayName,
                pictureUrl: lineProfile.pictureUrl,
            },
            create: {
                lineUserId: lineProfile.userId,
                displayName: lineProfile.displayName,
                pictureUrl: lineProfile.pictureUrl,
            },
        })

        // sign JWT ของเราเอง (แยกจาก staff)
        const token = await signToken({
            userId: customer.id,
            lineUserId: customer.lineUserId,
            displayName: customer.displayName,
            role: 'CUSTOMER',
        })

        return { token, customer }

    } ,
}