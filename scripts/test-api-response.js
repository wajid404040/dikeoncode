const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testApiResponse() {
  try {
    console.log("🔍 Testing what the login API would return...");

    // Get a user directly from database (simulating what login would return)
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

    console.log("📊 Full user object from database:");
    console.log(JSON.stringify(user, null, 2));

    console.log("\n🔍 Key fields check:");
    console.log(`Has status: ${"status" in user}`);
    console.log(`Status value: ${user.status}`);
    console.log(`Has selectedAvatar: ${"selectedAvatar" in user}`);
    console.log(`selectedAvatar value: ${user.selectedAvatar}`);
    console.log(`Has selectedVoice: ${"selectedVoice" in user}`);
    console.log(`selectedVoice value: ${user.selectedVoice}`);

    // Simulate what the frontend would receive
    const { password, ...userForFrontend } = user;
    console.log("\n📱 What frontend receives (without password):");
    console.log(JSON.stringify(userForFrontend, null, 2));
  } catch (error) {
    console.error("❌ Error testing API response:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testApiResponse();
