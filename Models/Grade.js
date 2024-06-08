const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grade', gradeSchema);
