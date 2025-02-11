const Restaurant = require('../models/Restaurant');

const startQueueCleanup = () => {
  setInterval(async () => {
    try {
      const result = await Restaurant.updateMany(
        { 'names.0': { $exists: true } },
        {
          $pop: { names: -1 },
          $inc: { queue_size: -1 }
        }
      );
      console.log(`Queue cleanup: ${result.modifiedCount} restaurants updated`);
    } catch (error) {
      console.error('Queue cleanup error:', error);
    }
  }, 30000);
};

module.exports = startQueueCleanup;