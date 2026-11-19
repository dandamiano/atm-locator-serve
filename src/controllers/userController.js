const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ Register User (Admin or Customer)
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if email is already taken
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const newUser = await User.create({ username, email, password: hashedPassword, role });

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

        // Generate token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in .env");
            return res.status(500).json({ message: "Server misconfigured" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "success", user, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (error){
        res.status(500).json({ message: "Server error" });
    }
};

// GET /admin/profile
exports.getAdminProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        return res.status(200).json({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
