const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("🗑️  Clearing all users from database...");

    // Delete all users
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} users`);

    console.log("\n👤 Creating fresh admin user...");

    // Create new admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        surname: "User",
        email: "admin@dia.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8j5qKqG", // password: admin123
        status: "APPROVED",
        selectedAvatar: "avatar1",
        selectedVoice: "alloy",
        voiceSettings: {
          speed: 1.0,
          pitch: 1.0,
          volume: 1.0,
        },
        approvedAt: new Date(),
        approvedBy: "reset-script",
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Login Details:");
    console.log("Email: admin@dia.com");
    console.log("Password: admin123");
    console.log(`User ID: ${adminUser.id}`);
    console.log("Status: APPROVED");
    console.log("Avatar: avatar1");
    console.log("Voice: alloy");

    console.log("\n🎉 Database reset complete!");
    console.log("You can now login with the admin account above.");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset
resetDatabase();
