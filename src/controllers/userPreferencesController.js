const UserPreference = require("../models/userPreference");
const User = require("../models/user");

exports.savePreferences = async (req, res) => {
  try {
    const { accessibility, radius, waitTime, selectedServices } = req.body;
    const { userId } = req.params;
    // Ensure the user exists
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save or update preferences for the user (one record per user)
    await UserPreference.destroy({ where: { userId } }); // Delete existing preferences for the user

    const newPrefs = await UserPreference.create({
      accessibility,
      radius,
      waitTime,
      selectedServices,
      userId,
    });

    res.status(201).json(newPrefs);
  } catch (error) {
    console.error("Save Preferences Error:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch preferences for the user
    const prefs = await UserPreference.findOne({ where: { userId } });

    if (!prefs) {
      return res.status(404).json({ message: "No preferences found for this user" });
    }

    res.status(200).json(prefs);
  } catch (error) {
    console.error("Get Preferences Error:", error);
    res.status(500).json({ error: "Failed to retrieve preferences" });
  }
};
