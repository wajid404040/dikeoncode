const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testUserData() {
  try {
    console.log("🔍 Testing user data structure...");

    // Get a user directly from database
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        approvedAt: true,
        approvedBy: true,
        selectedAvatar: true,
        selectedVoice: true,
        voiceSettings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      console.log("❌ No users found");
      return;
    }

    console.log("📊 User data from database:");
    console.log(JSON.stringify(user, null, 2));

    console.log("\n🔍 Checking specific fields:");
    console.log(`Status: ${user.status} (type: ${typeof user.status})`);
    console.log(`Has status field: ${"status" in user}`);
    console.log(`Status === 'APPROVED': ${user.status === "APPROVED"}`);
  } catch (error) {
    console.error("❌ Error testing user data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testUserData();
