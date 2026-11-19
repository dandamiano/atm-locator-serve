const { ATM } = require("../models"); // Import the ATM model

// Get all ATMs
exports.getAllATMs = async (req, res) => {
    try {
        const atms = await ATM.findAll(); // Use Sequelize ORM instead of raw SQL
        res.json(atms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add ATM
exports.addATM = async (req, res) => {
    try {
        const { name, location, latitude, longitude, status } = req.body;
        
        // Use Sequelize to create an ATM record
        const newATM = await ATM.create({ name, location, latitude, longitude, status });

        res.status(201).json({ message: "ATM added successfully", atm: newATM });
    } catch (error) {
        console.error("Error adding ATM:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update ATM
exports.updateATM = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, latitude, longitude, status } = req.body;

        // Use Sequelize to update an ATM record
        const updatedATM = await ATM.update(
            { name, location, latitude, longitude, status },
            { where: { id } }
        );

        if (updatedATM[0] === 0) {
            return res.status(404).json({ message: "ATM not found" });
        }

        res.json({ message: "ATM updated successfully" });
    } catch (error) {
        console.error("Error updating ATM:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete ATM
exports.deleteATM = async (req, res) => {
    try {
        const { id } = req.params;

        // Use Sequelize to delete an ATM
        const deletedATM = await ATM.destroy({ where: { id } });

        if (!deletedATM) {
            return res.status(404).json({ message: "ATM not found" });
        }

        res.json({ message: "ATM deleted successfully" });
    } catch (error) {
        console.error("Error deleting ATM:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update ATM status only
exports.updateATMStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const updatedATM = await ATM.update(
            { status },
            { where: { id } }
        );

        if (updatedATM[0] === 0) {
            return res.status(404).json({ message: "ATM not found" });
        }

        res.json({ message: "ATM status updated successfully" });
    } catch (error) {
        console.error("Error updating ATM status:", error);
        res.status(500).json({ error: error.message });
    }
};
