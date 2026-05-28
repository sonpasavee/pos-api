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

    async create(restaurantId: string , number: number) {
        const existing = await prisma.table.findUnique({
            where: { restaurantId_number: { restaurantId , number } }
        })

        if(existing) {
            throw new Error('TABLE_EXISTS')
        }
        return await prisma.table.create({
            data: { number , restaurantId }
        })
    } , 

    async remove(id: string , restaurantId: string) {
        const table = await prisma.table.findFirst({
            where: { id , restaurantId }
        })

        if(!table) {
            throw new Error('NOT_FOUND')
        }

        await prisma.table.delete({
            where: { id } 
        }) 

        return { message: 'DELETED' }
    }
}