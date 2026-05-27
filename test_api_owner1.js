const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPI() {
  const emailToTest = 'owner1@example.com';
  const registerUrl = 'http://localhost:4000/auth/register';
  const loginUrl = 'http://localhost:4000/auth/login';
  const meUrl = 'http://localhost:4000/auth/me';

  console.log("=== ขั้นตอนที่ 0: ล้างข้อมูลเก่าใน Database เพื่อผลการทดสอบที่สะอาด ===");
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: emailToTest }
    });

    if (existingUser) {
      console.log(`พบข้อมูลของ ${emailToTest} อยู่แล้ว. กำลังทำการลบข้อมูลเก่า...`);
      // ลบ user
      await prisma.user.delete({
        where: { email: emailToTest }
      });
      // ลบ restaurant ของ user
      await prisma.restaurant.delete({
        where: { id: existingUser.restaurantId }
      });
      console.log("ล้างข้อมูลเรียบร้อย!");
    } else {
      console.log("ไม่พบข้อมูลเก่า ดำเนินการทดสอบได้ทันที.");
    }
  } catch (dbErr) {
    console.warn("แจ้งเตือนการล้างข้อมูลใน DB:", dbErr.message);
  } finally {
    await prisma.$disconnect();
  }

  const registerData = {
    restaurantName: "Owner1 Premium Restaurant",
    email: emailToTest,
    password: "Password123!",
    name: "Owner One"
  };

  console.log("\n=== ขั้นตอนที่ 1: ยิง API Register เพื่อสมัครสมาชิก ===");
  console.log("POST:", registerUrl);
  console.log("Request Payload:", JSON.stringify(registerData, null, 2));

  try {
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json();
    console.log("Response Status:", registerResponse.status);
    console.log("Response Body:", JSON.stringify(registerResult, null, 2));

    if (!registerResponse.ok) {
      throw new Error(`Register failed with status ${registerResponse.status}`);
    }

    console.log("\n=== ขั้นตอนที่ 2: ยิง API Login เพื่อเข้าสู่ระบบ ===");
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };
    console.log("POST:", loginUrl);
    console.log("Request Payload:", JSON.stringify(loginData, null, 2));

    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    const loginResult = await loginResponse.json();
    console.log("Response Status:", loginResponse.status);
    console.log("Response Body:", JSON.stringify(loginResult, null, 2));

    if (!loginResponse.ok) {
      throw new Error(`Login failed with status ${loginResponse.status}`);
    }

    const token = loginResult.token;

    console.log("\n=== ขั้นตอนที่ 3: ยิง API /me เพื่อดึงข้อมูล Profile ด้วย Token ===");
    console.log("GET:", meUrl);
    console.log(`Authorization Header: Bearer ${token}`);

    const meResponse = await fetch(meUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const meResult = await meResponse.json();
    console.log("Response Status:", meResponse.status);
    console.log("Response Body:", JSON.stringify(meResult, null, 2));

  } catch (error) {
    console.error("การทดสอบล้มเหลว:", error.message);
  }
}

testAPI();
