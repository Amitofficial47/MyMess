// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

// const prisma = new PrismaClient();

// const initialMenuData = {
// 	Monday: {
// 		Breakfast: { item: "Poha, Jalebi", available: true },
// 		Lunch: { item: "Rajma, Rice, Roti", available: true },
// 		Dinner: { item: "Aloo Gobi, Roti", available: true },
// 	},
// 	Tuesday: {
// 		Breakfast: { item: "Idli, Sambar", available: true },
// 		Lunch: { item: "Chole Bhature", available: true },
// 		Dinner: { item: "Paneer Butter Masala, Roti", available: true },
// 	},
// 	Wednesday: {
// 		Breakfast: { item: "Aloo Paratha, Curd", available: true },
// 		Lunch: { item: "Kadhi Pakoda, Rice", available: true },
// 		Dinner: { item: "Mix Veg, Dal, Roti", available: true },
// 	},
// 	Thursday: {
// 		Breakfast: { item: "Upma, Coconut Chutney", available: true },
// 		Lunch: { item: "Dal Makhani, Naan", available: true },
// 		Dinner: { item: "Bhindi Masala, Roti", available: true },
// 	},
// 	Friday: {
// 		Breakfast: { item: "Dosa, Sambar", available: true },
// 		Lunch: { item: "Veg Biryani, Raita", available: true },
// 		Dinner: { item: "Malai Kofta, Roti", available: true },
// 	},
// 	Saturday: {
// 		Breakfast: { item: "Masala Oats", available: true },
// 		Lunch: { item: "Special Thali", available: true },
// 		Dinner: { item: "Pasta", available: true },
// 	},
// 	Sunday: {
// 		Breakfast: { item: "Puri Sabji", available: true },
// 		Lunch: { item: "Paneer Tikka, Rice", available: true },
// 		Dinner: { item: "Closed", available: false },
// 	},
// };

// async function main() {
// 	console.log("Starting seeding process...");

// 	// Seed Super Admin User
// 	const superAdminEmail = process.env.SUPERADMIN_EMAIL;
// 	const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

// 	if (!superAdminEmail || !superAdminPassword) {
// 		console.error(
// 			"❌ SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in your .env file"
// 		);
// 		process.exit(1);
// 	}

// 	let superAdminUser = await prisma.user.findUnique({
// 		where: { email: superAdminEmail },
// 	});

// 	if (!superAdminUser) {
// 		console.log(`Creating superadmin user for email: ${superAdminEmail}...`);
// 		const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
// 		superAdminUser = await prisma.user.create({
// 			data: {
// 				name: "Super Admin",
// 				email: superAdminEmail,
// 				password: hashedPassword,
// 				role: "SUPERADMIN",
// 				hostel: "All", // Superadmin manages all hostels
// 				status: "APPROVED", // Superadmin is always approved
// 				enrollmentNumber: null, // Explicitly set null for non-student roles
// 				course: null, // Explicitly set null for non-student roles
// 			},
// 		});
// 		console.log(`✅ Created superadmin user with id: ${superAdminUser.id}`);
// 	} else {
// 		console.log("ℹ️ Superadmin user already exists. Skipping creation.");
// 	}

// 	// Seed Menu
// 	const menuCount = await prisma.menuItem.count();
// 	if (menuCount === 0) {
// 		console.log("Seeding menu items...");
// 		for (const day of Object.keys(initialMenuData)) {
// 			for (const meal of Object.keys(
// 				initialMenuData[day as keyof typeof initialMenuData]
// 			)) {
// 				const mealData =
// 					initialMenuData[day as keyof typeof initialMenuData][
// 						meal as keyof (typeof initialMenuData)[keyof typeof initialMenuData]
// 					];
// 				await prisma.menuItem.create({
// 					data: {
// 						dayOfWeek: day as any,
// 						mealType: meal as any,
// 						item: mealData.item,
// 						available: mealData.available,
// 					},
// 				});
// 			}
// 		}
// 		console.log("✅ Seeded menu items.");
// 	} else {
// 		console.log("ℹ️ Menu items already exist. Skipping seeding.");
// 	}
// }

// main()
// 	.then(async () => {
// 		console.log("✅ Seeding finished successfully.");
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error("❌ An error occurred during seeding:");
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
// 	});

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateUserId } from "@/lib/utils";

const prisma = new PrismaClient();

const initialMenuData = {
	Monday: {
		Breakfast: { item: "Poha, Jalebi", available: true },
		Lunch: { item: "Rajma, Rice, Roti", available: true },
		Dinner: { item: "Aloo Gobi, Roti", available: true },
	},
	Tuesday: {
		Breakfast: { item: "Idli, Sambar", available: true },
		Lunch: { item: "Chole Bhature", available: true },
		Dinner: { item: "Paneer Butter Masala, Roti", available: true },
	},
	Wednesday: {
		Breakfast: { item: "Aloo Paratha, Curd", available: true },
		Lunch: { item: "Kadhi Pakoda, Rice", available: true },
		Dinner: { item: "Mix Veg, Dal, Roti", available: true },
	},
	Thursday: {
		Breakfast: { item: "Upma, Coconut Chutney", available: true },
		Lunch: { item: "Dal Makhani, Naan", available: true },
		Dinner: { item: "Bhindi Masala, Roti", available: true },
	},
	Friday: {
		Breakfast: { item: "Dosa, Sambar", available: true },
		Lunch: { item: "Veg Biryani, Raita", available: true },
		Dinner: { item: "Malai Kofta, Roti", available: true },
	},
	Saturday: {
		Breakfast: { item: "Masala Oats", available: true },
		Lunch: { item: "Special Thali", available: true },
		Dinner: { item: "Pasta", available: true },
	},
	Sunday: {
		Breakfast: { item: "Puri Sabji", available: true },
		Lunch: { item: "Paneer Tikka, Rice", available: true },
		Dinner: { item: "Closed", available: false },
	},
};

async function main() {
	console.log("Starting seeding process...");

	// Seed Super Admin User
	const superAdminEmail = process.env.SUPERADMIN_EMAIL;
	const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

	if (!superAdminEmail || !superAdminPassword) {
		console.error(
			"❌ SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in your .env file"
		);
		process.exit(1);
	}

	let superAdminUser = await prisma.user.findUnique({
		where: { email: superAdminEmail },
	});

	if (!superAdminUser) {
		console.log(`Creating superadmin user for email: ${superAdminEmail}...`);
		const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
		superAdminUser = await prisma.user.create({
			data: {
				displayId: generateUserId(),
				name: "Super Admin",
				email: superAdminEmail,
				password: hashedPassword,
				role: "SUPERADMIN",
				hostel: "All", // Superadmin manages all hostels
				status: "APPROVED", // Superadmin is always approved
				enrollmentNumber: null, // Explicitly set null for non-student roles
				course: null, // Explicitly set null for non-student roles
			},
		});
		console.log(`✅ Created superadmin user with id: ${superAdminUser.id}`);
	} else {
		console.log("ℹ️ Superadmin user already exists. Skipping creation.");
	}

	// Seed Menu
	const menuCount = await prisma.menuItem.count();
	if (menuCount === 0) {
		console.log("Seeding menu items...");
		for (const day of Object.keys(initialMenuData)) {
			for (const meal of Object.keys(
				initialMenuData[day as keyof typeof initialMenuData]
			)) {
				const mealData =
					initialMenuData[day as keyof typeof initialMenuData][
						meal as keyof (typeof initialMenuData)[keyof typeof initialMenuData]
					];
				await prisma.menuItem.create({
					data: {
						dayOfWeek: day as any,
						mealType: meal as any,
						item: mealData.item,
						available: mealData.available,
					},
				});
			}
		}
		console.log("✅ Seeded menu items.");
	} else {
		console.log("ℹ️ Menu items already exist. Skipping seeding.");
	}
}

main()
	.then(async () => {
		console.log("✅ Seeding finished successfully.");
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error("❌ An error occurred during seeding:");
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
