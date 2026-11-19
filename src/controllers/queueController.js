const { Queue } = require('../models');

exports.handleQueueUpdate = async (data) => {
    try {
      const [queueEntry, created] = await Queue.findOrCreate({
        where: { atm_id: data.atm_id },
        defaults: {
          count: data.count,
          timestamp: new Date(data.timestamp),
          source: data.source || 'Camera 1'
        }
      });
  
      if (!created) {
        // Update existing entry
        queueEntry.count = data.count;
        queueEntry.timestamp = new Date(data.timestamp);
        queueEntry.source = data.source || 'Camera 1';
        await queueEntry.save();
  
        console.log('[DB] Queue count updated:', queueEntry.count);
      } else {
        console.log('[DB] Queue count created:', queueEntry.count);
      }
      
    } catch (err) {
      console.error('[DB ERROR]', err);
    }
  };
  

exports.getQueueData = async (req, res) => {
  try {
    const data = await Queue.findAll({
      order: [['timestamp', 'DESC']],
      limit: 20
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queue data' });
  }
};