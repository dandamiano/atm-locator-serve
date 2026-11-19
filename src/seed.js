/**
 * Seed default users + sample ATM data.
 * Run from src/:  node seed.js
 */
const bcrypt = require("bcryptjs");
const db = require("./models");

const DEFAULT_USERS = [
    {
        username: "Admin",
        email: "admin@atmlocator.com",
        password: "admin123",
        role: "admin"
    },
    {
        username: "Customer",
        email: "customer@atmlocator.com",
        password: "customer123",
        role: "customer"
    }
];

const SAMPLE_ATMS = [
    {
        name: "CBD Main Branch ATM",
        location: "123 Main St, City Center",
        latitude: -26.2041,
        longitude: 28.0473,
        status: "active",
        waitTime: 5,
        accessibility: true,
        services: { withdrawal: true, "balance inquiry": true, cardless: true, deposit: true }
    },
    {
        name: "Mall Entrance ATM",
        location: "Sandton City Mall, Level 1",
        latitude: -26.1076,
        longitude: 28.0567,
        status: "active",
        waitTime: 12,
        accessibility: true,
        services: { withdrawal: true, "balance inquiry": true, cardless: false, deposit: false }
    },
    {
        name: "University Campus ATM",
        location: "Campus Drive, Student Center",
        latitude: -26.1929,
        longitude: 28.0305,
        status: "active",
        waitTime: 8,
        accessibility: false,
        services: { withdrawal: true, "balance inquiry": true, cardless: true, deposit: false }
    },
    {
        name: "Airport Terminal ATM",
        location: "OR Tambo Intl, Terminal A",
        latitude: -26.1367,
        longitude: 28.2411,
        status: "inactive",
        waitTime: 0,
        accessibility: true,
        services: { withdrawal: true, "balance inquiry": true, cardless: false, deposit: true }
    },
    {
        name: "Suburban Plaza ATM",
        location: "45 Oak Avenue, Rosebank",
        latitude: -26.1461,
        longitude: 28.0436,
        status: "active",
        waitTime: 3,
        accessibility: true,
        services: { withdrawal: true, "balance inquiry": true, cardless: true, deposit: false }
    }
];

async function seed() {
    try {
        await db.sequelize.authenticate();
        console.log("Database connected...");

        await db.sequelize.sync({ alter: true });

        // Users (skip if email already exists)
        for (const user of DEFAULT_USERS) {
            const existing = await db.User.findOne({ where: { email: user.email } });
            if (existing) {
                console.log(`User already exists: ${user.email}`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.User.create({ ...user, password: hashedPassword });
            console.log(`Created ${user.role}: ${user.email} / ${user.password}`);
        }

        // ATMs (only seed if table is empty)
        const atmCount = await db.ATM.count();
        if (atmCount === 0) {
            await db.ATM.bulkCreate(SAMPLE_ATMS);
            console.log(`Created ${SAMPLE_ATMS.length} sample ATMs`);
        } else {
            console.log(`ATMs already present (${atmCount}), skipping sample ATMs`);
        }

        // Sample feedback on first ATM
        const firstAtm = await db.ATM.findOne();
        const feedbackCount = await db.Feedback.count();
        if (firstAtm && feedbackCount === 0) {
            await db.Feedback.bulkCreate([
                {
                    atm_id: firstAtm.id,
                    user_email: "customer@atmlocator.com",
                    message: "ATM was out of cash yesterday evening.",
                    status: "pending"
                },
                {
                    atm_id: firstAtm.id,
                    user_email: "customer@atmlocator.com",
                    message: "Quick service, no queue.",
                    status: "resolved"
                }
            ]);
            console.log("Created sample feedback");
        }

        console.log("\nSeed complete.");
        console.log("Login with:");
        console.log("  Admin:    admin@atmlocator.com / admin123");
        console.log("  Customer: customer@atmlocator.com / customer123");
    } catch (err) {
        console.error("Seed failed:", err);
        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
}

seed();
