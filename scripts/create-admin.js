const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log("🗑️  Clearing all users from database...");

    // Delete all users
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.count} users`);

    console.log("\n👤 Creating fresh admin user...");

    // Hash password properly
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin",
        surname: "User",
        email: "admin@dia.com",
        password: hashedPassword,
        status: "APPROVED",
        selectedAvatar: "avatar1",
        selectedVoice: "alloy",
        voiceSettings: {
          speed: 1.0,
          pitch: 1.0,
          volume: 1.0,
        },
        lastSeen: new Date(), // Set initial lastSeen
        approvedAt: new Date(),
        approvedBy: "create-admin-script",
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
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation
createAdmin();
