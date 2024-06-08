const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  admissionDate: { type: Date, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  siblings: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  fees: [
    {
      feeType: { type: String, required: true },
      amount: { type: Number, required: true },
      dueDate: { type: Date, required: true },
      paid: { type: Boolean, default: false },
    },
  ],
  attendance: [
    {
      date: { type: Date, required: true },
      present: { type: Boolean, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;