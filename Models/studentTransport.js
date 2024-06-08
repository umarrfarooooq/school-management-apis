const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentTransportSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  transportRoute: {
    type: Schema.Types.ObjectId,
    ref: 'TransportRoute',
    required: true,
  },
  boardingStop: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const StudentTransport = mongoose.model('StudentTransport', studentTransportSchema);

module.exports = StudentTransport;