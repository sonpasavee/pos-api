import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const restaurant = await prisma.restaurant.create({
        data: { name: 'ร้านทดสอบ', slug: 'test-restaurant-' + Date.now() },
    })

    await prisma.user.createMany({
        data: [
            {
                email: 'owner@test.com',
                passwordHash: await bcrypt.hash('password123', 10),
                name: 'เจ้าของร้าน',
                role: 'OWNER',
                restaurantId: restaurant.id,
            },
            {
                email: 'staff@test.com',
                passwordHash: await bcrypt.hash('password123', 10),
                name: 'พนักงาน',
                role: 'STAFF',
                restaurantId: restaurant.id,
            },
        ],
    })

    await prisma.table.createMany({
        data: [1, 2, 3, 4, 5].map((n) => ({
            number: n,
            restaurantId: restaurant.id,
        })),
    })

    await prisma.menuItem.createMany({
        data: [
            { name: 'ผัดกะเพราหมู', category: 'อาหารจานเดียว', price: 60, restaurantId: restaurant.id },
            { name: 'ต้มยำกุ้ง', category: 'ซุป', price: 120, restaurantId: restaurant.id },
            { name: 'ข้าวมันไก่', category: 'อาหารจานเดียว', price: 55, restaurantId: restaurant.id },
            { name: 'น้ำเปล่า', category: 'เครื่องดื่ม', price: 15, restaurantId: restaurant.id },
            { name: 'ชาเย็น', category: 'เครื่องดื่ม', price: 35, restaurantId: restaurant.id },
        ],
    })

    // --- เพิ่มข้อมูลใหม่ให้สมบูรณ์ขึ้น ---
    
    // ดึงข้อมูลโต๊ะและเมนูที่เพิ่งสร้างเพื่อเอา ID ไปผูกกับออเดอร์
    const tables = await prisma.table.findMany({ where: { restaurantId: restaurant.id } })
    const menus = await prisma.menuItem.findMany({ where: { restaurantId: restaurant.id } })

    // 1. จำลอง Customer (ลูกค้าที่ล็อกอินผ่าน LINE)
    const customer = await prisma.customer.create({
        data: {
            lineUserId: 'U1234567890abcdef' + Date.now(),
            displayName: 'คุณลูกค้า ทดสอบ',
            pictureUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        }
    })

    // 2. จำลอง Order (แบบที่กำลังรอทำ PENDING)
    if (tables.length > 0 && menus.length >= 2) {
        await prisma.order.create({
            data: {
                tableId: tables[0].id,
                customerId: customer.id,
                status: 'PENDING',
                total: 120, // (60 * 2)
                note: 'ขอเผ็ดๆ ไม่ใส่ใบกะเพรา',
                items: {
                    create: [
                        { menuItemId: menus[0].id, quantity: 2, price: menus[0].price } // ผัดกะเพรา 2 จาน
                    ]
                }
            }
        })

        // 3. จำลอง Order (แบบที่กินเสร็จและจ่ายเงินแล้ว COMPLETED)
        await prisma.order.create({
            data: {
                tableId: tables[1].id,
                customerId: customer.id,
                status: 'COMPLETED',
                total: 175, // (120 * 1) + (55 * 1)
                items: {
                    create: [
                        { menuItemId: menus[1].id, quantity: 1, price: menus[1].price }, // ต้มยำกุ้ง
                        { menuItemId: menus[2].id, quantity: 1, price: menus[2].price }  // ข้าวมันไก่
                    ]
                },
                payment: {
                    create: {
                        amount: 175,
                        method: 'PROMPTPAY',
                        status: 'PAID'
                    }
                }
            }
        })
    }

    console.log('✅ Seed สำเร็จ')
    console.log('------------------------------------------------------')
    console.log('📌 นำข้อมูลด้านล่างนี้ไปใส่ในตัวแปร Postman / api-tests.http')
    console.log(`@restaurantId = ${restaurant.id}`)
    console.log(`@tableId = ${tables[0].id}`)
    console.log(`@menuItemId = ${menus[0].id}`)
    console.log('------------------------------------------------------')
    console.log('📧 Login Staff: staff@test.com / password123')
    console.log('📧 Login Owner: owner@test.com / password123')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())