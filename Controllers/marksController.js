const { Marks } = require("../Models/Exam-Mark");
const { Exam } = require("../Models/Exam-Mark");
const Student = require("../Models/Student");
const Subject = require("../Models/Subject");

exports.addMarks = async (req, res) => {
  try {
    const { examId, studentId, subjectId, marks } = req.body;

    const exam = await Exam.findById(examId);
    const student = await Student.findById(studentId);
    const subject = await Subject.findById(subjectId);

    if (!exam || !student || !subject) {
      return res
        .status(404)
        .json({ error: "Exam, student, or subject not found" });
    }

    const newMarks = new Marks({
      examId,
      studentId,
      subjectId,
      marks,
    });

    await newMarks.save();
    res.status(201).json(newMarks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMarks = async (req, res) => {
  try {
    const marks = await Marks.find()
      .populate("examId")
      .populate("studentId")
      .populate("subjectId");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMarksByExamId = async (req, res) => {
  try {
    const marks = await Marks.find({ examId: req.params.examId })
      .populate("examId")
      .populate("studentId")
      .populate("subjectId");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMarksByStudentId = async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.id })
      .populate("examId")
      .populate("studentId")
      .populate("subjectId");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMarks = async (req, res) => {
  try {
    const updatedMarks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("examId")
      .populate("studentId")
      .populate("subjectId");
    if (!updatedMarks) {
      return res.status(404).json({ error: "Marks not found" });
    }
    res.json(updatedMarks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMarks = async (req, res) => {
  try {
    const deletedMarks = await Marks.findByIdAndDelete(req.params.id);
    if (!deletedMarks) {
      return res.status(404).json({ error: "Marks not found" });
    }
    res.json({ message: "Marks deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
