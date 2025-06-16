const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
  camera_id: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  anomaly_type: {
    type: String,
    default: 'Smoking',
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  video_path: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Anomaly', anomalySchema);
