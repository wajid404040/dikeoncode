const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log("🔍 Looking for users in the database...");

    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        status: true,
        createdAt: true,
      },
    });

    if (users.length === 0) {
      console.log("❌ No users found in the database.");
      console.log("Please create a user account first through the signup form.");
      return;
    }

    console.log(`📊 Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} ${user.surname} (${user.email}) - Status: ${user.status}`);
    });

    // Find the first user (oldest)
    const firstUser = users[0];

    if (firstUser.status === "APPROVED") {
      console.log("✅ First user is already approved!");
      console.log(`Admin: ${firstUser.name} ${firstUser.surname} (${firstUser.email})`);
      return;
    }

    console.log("\n🚀 Setting up first user as admin...");

    // Update first user to approved
    const updatedUser = await prisma.user.update({
      where: { id: firstUser.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: "setup-script",
      },
    });

    console.log("✅ Success! First user is now an admin.");
    console.log(`Admin: ${updatedUser.name} ${updatedUser.surname} (${updatedUser.email})`);
    console.log("\n🎉 You can now:");
    console.log("1. Login with your account");
    console.log('2. See the "Admin" button in the header');
    console.log("3. Click it to approve other users");
    console.log("4. Manage the waitlist");
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupAdmin();
