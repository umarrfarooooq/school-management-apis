const StudentTransport = require('../Models/studentTransport');

exports.assignStudentToTransportRoute = async (req, res) => {
  try {
    const { student, transportRoute, boardingStop } = req.body;

    const newStudentTransport = new StudentTransport({
      student,
      transportRoute,
      boardingStop,
    });

    const savedStudentTransport = await newStudentTransport.save();
    res.status(201).json(savedStudentTransport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStudentTransportAssignments = async (req, res) => {
  try {
    const studentTransportAssignments = await StudentTransport.find()
      .populate('student', 'name')
      .populate('transportRoute', 'name');

    res.json(studentTransportAssignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStudentTransportAssignmentById = async (req, res) => {
  try {
    const studentTransportAssignment = await StudentTransport.findById(req.params.id)
      .populate('student', 'name')
      .populate('transportRoute', 'name');

    if (!studentTransportAssignment) {
      return res.status(404).json({ error: 'Student transport assignment not found' });
    }

    res.json(studentTransportAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudentTransportAssignment = async (req, res) => {
  try {
    const updatedStudentTransport = await StudentTransport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('student', 'name');

    if (!updatedStudentTransport) {
      return res.status(404).json({ error: 'Student transport assignment not found' });
    }

    res.json(updatedStudentTransport);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStudentTransportAssignment = async (req, res) => {
  try {
    const deletedStudentTransport = await StudentTransport.findByIdAndDelete(req.params.id);

    if (!deletedStudentTransport) {
      return res.status(404).json({ error: 'Student transport assignment not found' });
    }

    res.json({ message: 'Student transport assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};