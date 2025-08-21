const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUserStatus() {
  try {
    console.log("🔍 Checking user status in database...");

    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        approvedAt: true,
        approvedBy: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      console.log("❌ No users found in the database.");
      return;
    }

    console.log(`📊 Found ${users.length} user(s):`);
    console.log("=".repeat(60));

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} ${user.surname}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   Created: ${user.createdAt}`);
      if (user.approvedAt) {
        console.log(`   Approved: ${user.approvedAt}`);
        console.log(`   Approved By: ${user.approvedBy}`);
      }
      console.log("   " + "-".repeat(40));
    });

    // Check if any users are approved
    const approvedUsers = users.filter((user) => user.status === "APPROVED");
    const waitlistUsers = users.filter((user) => user.status === "WAITLIST");

    console.log("\n📈 Summary:");
    console.log(`✅ Approved Users: ${approvedUsers.length}`);
    console.log(`⏳ Waitlist Users: ${waitlistUsers.length}`);

    if (approvedUsers.length === 0) {
      console.log("\n❌ No approved users found!");
      console.log("The admin button won't appear without approved users.");
    } else {
      console.log("\n✅ Approved users found - admin button should appear!");
    }
  } catch (error) {
    console.error("❌ Error checking user status:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkUserStatus();
