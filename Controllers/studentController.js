const Student = require('../Models/Student');
const Class = require('../Models/Class')
const Section = require('../Models/Section')
const User = require('../Models/User')


exports.createStudent = async (req, res) => {
  try {
    const { name, email, dateOfBirth, gender, address, phone, classId, sectionId, admissionDate, parentId } = req.body;

    const parent = await User.findById(parentId);
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    const studentClass = await Class.findById(classId);
    const studentSection = await Section.findById(sectionId);
    if (!studentClass || !studentSection) {
      return res.status(404).json({ error: 'Class or section not found' });
    }

    const newStudent = new Student({
      name,
      email,
      dateOfBirth,
      gender,
      address,
      phone,
      class: classId,
      section: sectionId,
      admissionDate,
      parentId,
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class').populate('section').populate('parentId');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('class').populate('section').populate('parentId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('class').populate('section').populate('parentId');
    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addSibling = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const sibling = await Student.findById(req.body.siblingId);
    if (!sibling) {
      return res.status(404).json({ error: 'Sibling not found' });
    }

    student.siblings.push(sibling._id);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { date, present } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = {
      date,
      present,
    };

    student.attendance.push(attendance);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addOrUpdateFees = async (req, res) => {
  try {
    const { feeType, amount, dueDate } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const feeIndex = student.fees.findIndex((fee) => fee.feeType === feeType);
    if (feeIndex === -1) {
      // Add new fee
      const newFee = {
        feeType,
        amount,
        dueDate,
        paid: false,
      };
      student.fees.push(newFee);
    } else {
      // Update existing fee
      student.fees[feeIndex].amount = amount;
      student.fees[feeIndex].dueDate = dueDate;
    }

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markFeePaid = async (req, res) => {
  try {
    const { feeType } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const feeIndex = student.fees.findIndex((fee) => fee.feeType === feeType);
    if (feeIndex === -1) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    student.fees[feeIndex].paid = true;
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};