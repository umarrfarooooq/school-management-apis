const { Exam } = require("../Models/Exam-Mark");
const Subject = require("../Models/Subject");
const Class = require("../Models/Class");

exports.createExam = async (req, res) => {
  try {
    const { name, description, startDate, endDate, subjects, classes } =
      req.body;

    const existingSubjects = await Subject.find({ _id: { $in: subjects } });
    const existingClasses = await Class.find({ _id: { $in: classes } });

    if (
      existingSubjects.length !== subjects.length ||
      existingClasses.length !== classes.length
    ) {
      return res
        .status(404)
        .json({ error: "One or more subjects or classes not found" });
    }

    const newExam = new Exam({
      name,
      description,
      startDate,
      endDate,
      subjects,
      classes,
    });

    await newExam.save();
    res.status(201).json(newExam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("subjects").populate("classes");
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("subjects")
      .populate("classes");
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("subjects")
      .populate("classes");
    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json(updatedExam);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
