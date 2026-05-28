import { prisma } from "../lib/db"

export const tableService = {
    async getAll(restaurantId: string) {
        return prisma.table.findMany({
            where: { restaurantId },
            orderBy: { number: 'asc' }
        })
    },

    async getByQrToken(qrToken: string) {
        const table = await prisma.table.findUnique({
            where: { qrToken },
            include: { restaurant: { select: { id: true, name: true, logoUrl: true } } },
        })

        if (!table) {
            throw new Error('NOT_FOUND')
        }
        return table
    },
}