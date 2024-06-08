const Class = require("../Models/Class");
const Subject = require("../Models/Subject");

exports.createClass = async (req, res) => {
  try {
    const { name, description, subjects } = req.body;

    const invalidSubjects = [];
    for (const subjectId of subjects) {
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        invalidSubjects.push(subjectId);
      }
    }

    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        error: `Invalid subject IDs: ${invalidSubjects.join(", ")}`,
      });
    }

    const newClass = new Class({ name, description, subjects });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("sections")
      .populate("subjects");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("sections")
      .populate("subjects");
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("sections")
      .populate("subjects");
    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};