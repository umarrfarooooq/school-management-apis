const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;