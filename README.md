# 🚀 POS API (Point of Sale API) - Backend

ระบบ API สำหรับจัดการระบบร้านอาหารและจุดขาย (Point of Sale) พัฒนาด้วย **Node.js**, **Express**, **TypeScript** และ **Prisma ORM** เชื่อมต่อกับฐานข้อมูล **PostgreSQL** พร้อมรองรับระบบ Real-time ด้วย **Socket.io**

---

## 🛠️ เทคโนโลยีที่เลือกใช้ (Technology Stack)

*   **Core**: Node.js & Express 5 (ความสามารถล่าสุดสำหรับแอปพลิเคชันยุคใหม่)
*   **Language**: TypeScript (ช่วยเขียนโค้ดได้ปลอดภัย ค้นหาบั๊กได้ก่อนรัน)
*   **Database ORM**: Prisma Client 6 (Type-safe query builder ที่ทรงพลัง)
*   **Database**: PostgreSQL (รองรับการทำ Connection Pooling เช่น Supabase)
*   **Authentication**: `jose` (JWT) และ `bcryptjs` (สำหรับเข้ารหัสรหัสผ่านอย่างปลอดภัย)
*   **Security & Logging**: CORS, Helmet (ป้องกันช่องโหว่ความปลอดภัยเบื้องต้น), Morgan (สำหรับ HTTP request logging)
*   **Validation**: Zod (สำหรับทำ Request validation/Schema checking)
*   **Real-time**: Socket.io (สำหรับอัปเดตสถานะออเดอร์และแจ้งเตือนพนักงานแบบทันที)

---

## 📂 โครงสร้างโปรเจกต์ (Project Directory Structure)

```text
pos-api/
├── prisma/               # ข้อมูลเกี่ยวกับฐานข้อมูล
│   ├── migrations/       # ประวัติการทำ database schema migrations
│   └── schema.prisma     # ไฟล์หลักสำหรับออกแบบ Database Schema
├── src/                  # โค้ดโปรแกรมหลัก
│   ├── controllers/      # ควบคุม Logic ของ API (รับ request -> ประมวลผล -> ส่ง response)
│   ├── routes/           # กำหนดเส้นทาง (Endpoints) ของ API
│   ├── middlewares/      # ตัวกรองคำสั่ง (เช่น ตรวจสอบความถูกต้อง, เช็ค Token ล็อกอิน)
│   ├── services/         # ฟังก์ชันการทำงานแยกเฉพาะ (เช่น การคิดเงิน, จัดการสต็อก)
│   ├── socket/           # จัดการระบบ Real-time (Socket.io)
│   ├── types/            # รวม TypeScript Types / Interfaces ต่างๆ
│   ├── validators/       # จัดการการตรวจสอบข้อมูลนำเข้าด้วย Zod
│   ├── app.ts            # การตั้งค่า Express App, CORS, Middleware กลาง
│   └── index.ts          # ไฟล์ Entrypoint หลักสำหรับเริ่มสตาร์ท Server
├── .env                  # การตั้งค่า Environment Variables (ความลับของระบบ)
├── package.json          # ไฟล์จัดการ Dependencies และ Scripts
└── tsconfig.json         # การตั้งค่าตัวแปลภาษา TypeScript (Compiler Config)
```

---

## 📊 โครงสร้างฐานข้อมูล (Database Schema)

โครงสร้างหลักของฐานข้อมูลประกอบด้วยโมเดลเหล่านี้:

1.  **Restaurant (ร้านอาหาร)**: เก็บข้อมูลร้านค้า, รูปโลโก้ และลิงก์ slug ของร้าน
2.  **User (ผู้ใช้งาน)**: พนักงานหรือเจ้าของร้าน มีบทบาท (Role) เป็น `OWNER` หรือ `STAFF`
3.  **Table (โต๊ะอาหาร)**: ข้อมูลโต๊ะ และมี `qrToken` ที่เปลี่ยนเป็น QR Code ให้ลูกค้าสแกนสั่งอาหารได้
4.  **MenuItem (เมนูอาหาร)**: ชื่อเมนู, รายละเอียด, หมวดหมู่, ราคา, รูปภาพ และสถานะความพร้อมขาย
5.  **Order (ออเดอร์)**: รายการสั่งซื้อของโต๊ะอาหาร มีสถานะเป็น `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`
6.  **OrderItem (รายการอาหารในออเดอร์)**: บันทึกว่าออเดอร์นั้นๆ สั่งเมนูอะไรไปบ้าง จำนวนเท่าไหร่ ราคาตอนสั่งซื้อ
7.  **Payment (การชำระเงิน)**: รายละเอียดการชำระเงิน ช่องทาง (`CASH`, `STRIPE`, `PROMPTPAY`) และสถานะเงิน (`PENDING`, `PAID`, `FAILED`, `REFUNDED`)

---

## 🚀 ขั้นตอนการติดตั้งและใช้งาน (Installation & Setup)

ทำตามขั้นตอนต่อไปนี้เพื่อเปิดใช้งานโปรเจกต์ในเครื่องของคุณ:

### 1. การเตรียมความพร้อมก่อนติดตั้ง (Prerequisites)
ตรวจสอบให้แน่ใจว่าเครื่องคอมพิวเตอร์ของคุณติดตั้ง:
*   [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน 18 LTS ขึ้นไป)
*   ฐานข้อมูล PostgreSQL (แนะนำให้สมัคร [Supabase](https://supabase.com/) เพื่อใช้บริการ Database Cloud ฟรี หรือติดตั้ง PostgreSQL บน Docker/เครื่องตัวเอง)

### 2. การโคลนและเปิดโปรเจกต์ (Clone & Open Project)
เข้าไปยังโฟลเดอร์โปรเจกต์ผ่าน Terminal / Command Prompt:
```bash
cd pos-api
```

### 3. ติดตั้ง Dependencies (Install Packages)
รันคำสั่งด้านล่างเพื่อดาวน์โหลดและติดตั้งโมดูลที่จำเป็นทั้งหมด:
```bash
npm install
```

### 4. การตั้งค่าตัวแปรสภาพแวดล้อม (Configure Environment Variables)
ในโฟลเดอร์โปรเจกต์จะมีไฟล์ `.env` ที่มีโครงสร้างตัวอย่างสำหรับการเชื่อมต่อกับ Supabase อยู่แล้ว หากต้องการตั้งค่าของคุณเอง ให้สร้างหรือแก้ไขไฟล์ `.env` ดังนี้:

```env
# URL สำหรับเชื่อมต่อฐานข้อมูลผ่านระบบ Pooling (แนะนำถ้าใช้ Supabase เพื่อลดภาระ DB)
DATABASE_URL="postgresql://username:password@your-database-host:6543/postgres?pgbouncer=true"

# URL สำหรับเชื่อมต่อฐานข้อมูลตรงๆ (จำเป็นสำหรับการรัน Migrations เพื่อโครงสร้างที่ถูกต้อง)
DIRECT_URL="postgresql://username:password@your-database-host:5432/postgres"

# คีย์ลับสำหรับสร้างและถอดรหัส JWT (สามารถเปลี่ยนเป็นข้อความสุ่มที่มีความปลอดภัยสูงได้)
JWT_SECRET="เปลี่ยนข้อความนี้เป็นความลับความปลอดภัยสูงสำหรับระบบของคุณ"

# ลิงก์ของแอปพลิเคชันฝั่งหน้าบ้าน (Frontend Client)
FRONTEND_URL="http://localhost:3000"

# พอร์ตสำหรับรัน API Backend นี้
PORT=4000
```

### 5. การตั้งค่าระบบฐานข้อมูลและ Prisma (Prisma & Database Setup)
เมื่อตั้งค่า `.env` เรียบร้อยแล้ว ให้รันคำสั่งเหล่านี้เพื่ออัปเดตและสร้างโครงสร้างตารางเข้าฐานข้อมูลของคุณ:

```bash
# 1. รัน Schema Migration เพื่อสร้างตารางทั้งหมดในฐานข้อมูล
npm run db:migrate

# 2. ทำการสร้างไฟล์ Prisma Client เพื่อให้โค้ดสามารถเรียกใช้งานฐานข้อมูลอย่างปลอดภัย
npx prisma generate
```

*(ทางเลือก)* หากคุณมีไฟล์ Seed ข้อมูลจำลองในอนาคต สามารถใช้คำสั่งนี้เพื่อนำข้อมูลตัวอย่างเข้าฐานข้อมูล:
```bash
npm run db:seed
```

---

## ⚡ คำสั่งหลักสำหรับรันระบบ (Scripts & Commands)

คุณสามารถรันคำสั่งต่อไปนี้ผ่าน Terminal:

*   **รันโปรเจกต์ในโหมดพัฒนา (Development Mode)**:
    ```bash
    npm run dev
    ```
    *(ระบบจะรีสตาร์ทอัตโนมัติเมื่อมีการแก้ไขโค้ดด้วย `ts-node-dev`)*

*   **คอมไพล์โค้ดเป็น JavaScript สำหรับนำไปใช้งานจริง (Production Build)**:
    ```bash
    npm run build
    ```
    *(ไฟล์ที่ผ่านการคอมไพล์จะไปอยู่ที่โฟลเดอร์ `dist/`)*

*   **รันเซิร์ฟเวอร์โหมด Production**:
    ```bash
    npm run start
    ```
    *(โปรดมั่นใจว่าได้ทำการรัน `npm run build` ก่อนเริ่มใช้งานคำสั่งนี้)*

*   **เปิด Prisma Studio (เครื่องมือดูและจัดการข้อมูลแบบ UI ผ่านเว็บเบราว์เซอร์)**:
    ```bash
    npm run db:studio
    ```
    *(ช่วยให้คุณเข้าไปเพิ่ม ลบ แก้ไข ข้อมูลตารางต่างๆ ได้ง่ายๆ ผ่าน UI ที่ `http://localhost:5555`)*

---

## 🧪 การทดสอบระบบเบื้องต้น (Verification)

เมื่อคุณเปิดเซิร์ฟเวอร์แล้ว (`npm run dev`) คุณสามารถทดสอบการเชื่อมต่อได้ง่ายๆ ดังนี้:

1.  เปิดเว็บเบราว์เซอร์หรือโปรแกรมเช่น Postman / Bruno
2.  เรียกไปที่ลิงก์ระบบ Health Check: `http://localhost:4000/health`
3.  หากระบบทำงานปกติ คุณจะได้รับผลลัพธ์เป็น:
    ```json
    { "status": "OK" }
    ```

---

## 🔒 แนวทางความปลอดภัย (Security Practices)

*   **รหัสผ่าน**: โค้ดของระบบออกแบบให้ใช้ `bcryptjs` ในการทำ Hashing ก่อนบันทึกรหัสผ่านลงฐานข้อมูลทุกครั้ง
*   **CORS**: มีระบบเช็ค Origin ของคำขอรับส่งข้อมูลผ่านตัวแปร `FRONTEND_URL` ในไฟล์ `.env`
*   **การโจมตีทางเว็บ**: ติดตั้ง `helmet` เพื่อป้องกัน HTTP Header Exploits ทั่วไปเรียบร้อยแล้ว
