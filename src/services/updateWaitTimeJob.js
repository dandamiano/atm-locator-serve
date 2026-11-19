const cron = require('node-cron');
const { updateATMWaitTimes } = require('../utils/updateATMWaitTimes');

// Run every 5 minutes
cron.schedule('*/3 * * * *', async () => {
  console.log('Updating all ATM wait times...');
  await updateATMWaitTimes();
});
