const Fee = require('../Models/Fee');
const Student = require('../Models/Student');

exports.createFee = async (req, res) => {
  try {
    const { studentId, feeType, amount, dueDate } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const newFee = new Fee({
      studentId,
      feeType,
      amount,
      dueDate,
    });

    await newFee.save();
    res.status(201).json(newFee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('studentId');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('studentId');
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('studentId');
    if (!updatedFee) {
      return res.status(404).json({ error: 'Fee not found' });
    }
    res.json(updatedFee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const deletedFee = await Fee.findByIdAndDelete(req.params.id);
    if (!deletedFee) {
      return res.status(404).json({ error: 'Fee not found' });
    }
    res.json({ message: 'Fee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markFeePaid = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    fee.paid = true;
    fee.paidOn = Date.now();
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    fee.discount = discount;
    fee.amount = fee.amount - discount;
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};