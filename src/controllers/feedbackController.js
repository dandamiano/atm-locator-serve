const { Feedback, ATM } = require("../models");

// ✅ Add feedback
exports.addFeedback = async (req, res) => {
    try {
        const { atm_id, user_email, message } = req.body;

        const atm = await ATM.findByPk(atm_id);
        if (!atm) return res.status(404).json({ message: "ATM not found" });

        const feedback = await Feedback.create({ atm_id, user_email, message });

        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get all feedbacks
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ include: [{ model: ATM, attributes: ["name", "location"] }] });
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get feedback for a specific ATM
exports.getFeedbackByATM = async (req, res) => {
    try {
        const { atm_id } = req.params;

        const feedbacks = await Feedback.findAll({
            where: { atm_id },
            include: [{ model: ATM, attributes: ["name", "location"] }]
        });

        if (feedbacks.length === 0) return res.status(404).json({ message: "No feedback found" });

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await Feedback.findByPk(id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        feedback.status = status || feedback.status;
        await feedback.save();

        res.status(200).json({ message: "Feedback updated", feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete feedback
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByPk(id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        await feedback.destroy();
        res.status(200).json({ message: "Feedback deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get feedback for a specific User
exports.getFeedbackByUser = async (req, res) => {
    try {
        const { user_email } = req.params;

        const feedbacks = await Feedback.findAll({
            where: { user_email },
            include: [{ model: ATM, attributes: ["name", "location"] }]
        });

        if (feedbacks.length === 0) {
            return res.status(404).json({ message: "No feedback found for this user" });
        }

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

