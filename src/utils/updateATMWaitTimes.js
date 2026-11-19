const { Queue, ATM } = require('../models'); // Adjust path if needed
const { Op } = require('sequelize');

const updateATMWaitTimes = async () => {
  try {
    // Step 1: Get distinct ATM IDs that have Queue entries
    const distinctAtmIds = await Queue.findAll({
      attributes: ['atm_id'],
      group: ['atm_id']
    });

    // Step 2: Loop over each ATM and update wait time
    for (const record of distinctAtmIds) {
      const atmId = record.atm_id;

      // Get the latest Queue record for this ATM
      const latestQueue = await Queue.findOne({
        where: { atm_id: atmId },
        order: [['timestamp', 'DESC']]
      });

      if (latestQueue) {
        // Calculate wait time
        const waitTime = latestQueue.count * latestQueue.avg_trans_time;

        // Update ATM wait time
        await ATM.update(
          { waitTime },
          { where: { id: atmId } }
        );

        console.log(`Updated ATM ID ${atmId} with new wait time: ${waitTime}`);
      }
    }
  } catch (error) {
    console.error('Error updating ATM wait times:', error);
  }
};

module.exports = { updateATMWaitTimes };
