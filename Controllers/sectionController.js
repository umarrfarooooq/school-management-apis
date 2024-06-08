const Class = require("../Models/Class");
const Section = require("../Models/Section");

exports.createSection = async (req, res) => {
  try {
    const { name, classId } = req.body;

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ error: "Class not found" });
    }

    const newSection = new Section({
      name,
      classId,
    });
    await newSection.save();

    classData.sections.push(newSection._id);
    await classData.save();

    res.status(201).json(newSection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate("classId");
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate("classId");
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("classId");
    if (!updatedSection) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json(updatedSection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
