// const { sequelize } = require('sequelize');
const sequelize = require("../config/db");
const { Op } = require("sequelize");
const ATM = require("../models/atm");
const Feedback = require("../models/feedback");
const UserPreference = require("../models/userPreference");
const User = require("../models/user");
const createPDFStream = require("../utils/generatePDF");

// 1. ATM Operational Summary
exports.getATMOperationalSummary = async (req, res) => {
  try {
    const totalATMs = await ATM.count();
    const activeATMs = await ATM.count({ where: { status: "active" } });
    const inactiveATMs = await ATM.count({ where: { status: "inactive" } });

    const accessibleATMs = await ATM.count({ where: { accessibility: true } });

    const groupedByLocation = await ATM.findAll({
      attributes: ["location", [sequelize.fn("COUNT", sequelize.col("location")), "count"]],
      group: ["location"]
    });

    const doc = createPDFStream(res, "ATM_Operational_Summary");
    doc.fontSize(18).text("ATM Operational Summary Report", { underline: true }).moveDown();
    doc.fontSize(12)
      .text(`Total ATMs: ${totalATMs}`)
      .text(`Active ATMs: ${activeATMs}`)
      .text(`Inactive ATMs: ${inactiveATMs}`)
      .text(`Accessible ATMs: ${accessibleATMs}`)
      .moveDown();

    doc.text("ATMs by Location:");
    groupedByLocation.forEach(loc => {
      doc.text(`- ${loc.location}: ${loc.dataValues.count}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. ATM Services Distribution
exports.getATMServicesDistribution = async (req, res) => {
  try {
    const atms = await ATM.findAll();
    let stats = {
      withdrawal: 0,
      balanceInquiry: 0,
      cardless: 0,
      deposit: 0
    };

    atms.forEach(atm => {
      const { services } = atm;
      if (services.withdrawal) stats.withdrawal++;
      if (services["balance inquiry"]) stats.balanceInquiry++;
      if (services.cardless) stats.cardless++;
      if (services.deposit) stats.deposit++;
    });

    const doc = createPDFStream(res, "ATM_Services_Distribution");
    doc.fontSize(18).text("ATM Services Distribution Report", { underline: true }).moveDown();
    doc.fontSize(12)
      .text(`Withdrawal Support: ${stats.withdrawal}`)
      .text(`Balance Inquiry Support: ${stats.balanceInquiry}`)
      .text(`Cardless Transactions Support: ${stats.cardless}`)
      .text(`Deposit Support: ${stats.deposit}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Queue Wait Time Report
exports.getQueueWaitTimeReport = async (req, res) => {
  try {
    const atms = await ATM.findAll({ attributes: ["name", "location", "waitTime"] });

    const averageWait = await ATM.findAll({
      attributes: [[sequelize.fn("AVG", sequelize.col("waitTime")), "averageWaitTime"]]
    });

    const busiest = await ATM.findAll({
      limit: 5,
      order: [["waitTime", "DESC"]]
    });

    const leastBusy = await ATM.findAll({
      limit: 5,
      order: [["waitTime", "ASC"]]
    });

    const doc = createPDFStream(res, "Queue_Wait_Time_Report");
    doc.fontSize(18).text("Queue Wait Time Report", { underline: true }).moveDown();
    doc.fontSize(12).text(`Average Wait Time: ${parseFloat(averageWait[0].dataValues.averageWaitTime).toFixed(2)} mins`).moveDown();

    doc.text("Busiest ATMs:");
    busiest.forEach(atm => doc.text(`- ${atm.name} (${atm.location}): ${atm.waitTime} mins`));
    doc.moveDown();

    doc.text("Least Busy ATMs:");
    leastBusy.forEach(atm => doc.text(`- ${atm.name} (${atm.location}): ${atm.waitTime} mins`));

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. User Feedback Analysis
exports.getUserFeedbackAnalysis = async (req, res) => {
  try {
    const total = await Feedback.count();
    const resolved = await Feedback.count({ where: { status: "resolved" } });
    const pending = await Feedback.count({ where: { status: "pending" } });

    const mostReportedATMs = await Feedback.findAll({
      attributes: ["atm_id", [sequelize.fn("COUNT", sequelize.col("atm_id")), "reportCount"]],
      group: ["atm_id"],
      order: [[sequelize.fn("COUNT", sequelize.col("atm_id")), "DESC"]],
      limit: 5
    });

    const latest = await Feedback.findAll({ order: [["createdAt", "DESC"]], limit: 10 });

    const doc = createPDFStream(res, "User_Feedback_Analysis");
    doc.fontSize(18).text("User Feedback Analysis Report", { underline: true }).moveDown();
    doc.fontSize(12)
      .text(`Total Feedback Entries: ${total}`)
      .text(`Resolved Issues: ${resolved}`)
      .text(`Pending Issues: ${pending}`)
      .moveDown();

    doc.text("Most Reported ATMs:");
    mostReportedATMs.forEach(r => doc.text(`- ATM ID ${r.atm_id}: ${r.dataValues.reportCount} reports`));
    doc.moveDown();

    doc.text("Latest Feedback:");
    latest.forEach(fb => doc.text(`- User ${fb.userId}: ${fb.message} [${fb.status}]`));

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. User Preferences vs ATM Availability
exports.getUserPreferencesReport = async (req, res) => {
  try {
    const totalPreferences = await UserPreference.count();
    const accessibleUsers = await UserPreference.count({ where: { accessibility: true } });
    const allPreferences = await UserPreference.findAll();

    let requestedServices = {
      withdrawal: 0,
      balanceInquiry: 0,
      cardless: 0,
      deposit: 0
    };

    allPreferences.forEach(pref => {
      const services = pref.selectedServices;
      if (services.withdrawal) requestedServices.withdrawal++;
      if (services["balance inquiry"]) requestedServices.balanceInquiry++;
      if (services.cardless) requestedServices.cardless++;
      if (services.deposit) requestedServices.deposit++;
    });

    const availableATMs = await ATM.findAll();
    let availableServices = {
      withdrawal: 0,
      balanceInquiry: 0,
      cardless: 0,
      deposit: 0
    };

    availableATMs.forEach(atm => {
      const services = atm.services;
      if (services.withdrawal) availableServices.withdrawal++;
      if (services["balance inquiry"]) availableServices.balanceInquiry++;
      if (services.cardless) availableServices.cardless++;
      if (services.deposit) availableServices.deposit++;
    });

    const doc = createPDFStream(res, "User_Preferences_vs_ATM_Availability");
    doc.fontSize(18).text("User Preferences vs ATM Availability", { underline: true }).moveDown();
    doc.fontSize(12)
      .text(`Total User Preferences: ${totalPreferences}`)
      .text(`Users Needing Accessibility: ${accessibleUsers}`)
      .moveDown();

    doc.text("Requested Services:");
    Object.entries(requestedServices).forEach(([service, count]) => {
      doc.text(`- ${service}: ${count}`);
    });

    doc.moveDown();
    doc.text("Available ATM Services:");
    Object.entries(availableServices).forEach(([service, count]) => {
      doc.text(`- ${service}: ${count}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};