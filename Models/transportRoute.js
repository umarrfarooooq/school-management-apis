const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transportRouteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  stops: [
    {
      location: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

const TransportRoute = mongoose.model('TransportRoute', transportRouteSchema);

module.exports = TransportRoute;