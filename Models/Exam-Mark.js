const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const examSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  }],
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const marksSchema = new Schema({
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  marks: {
    type: Number,
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

const Exam = mongoose.model('Exam', examSchema);
const Marks = mongoose.model('Marks', marksSchema);

module.exports = { Exam, Marks };