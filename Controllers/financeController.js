const Finance = require("../Models/Finance");

exports.createFinance = async (req, res) => {
  try {
    const { fullName, type, description, amount, transactionType } = req.body;
    const newFinance = new Finance({
      fullName,
      type,
      description,
      amount,
      transactionType,
    });
    await newFinance.save();
    res.status(201).json(newFinance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllFinance = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const endDate = new Date();

    switch (period) {
      case "today":
        startDate = new Date(endDate.setHours(0, 0, 0, 0));
        break;
      case "weekly":
        startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        break;
      case "monthly":
        startDate = new Date(endDate.setMonth(endDate.getMonth() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    const finances = await Finance.find({
      createdAt: { $gte: startDate, $lte: new Date() },
    }).sort({ createdAt: -1 });

    res.json(finances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinanceById = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    if (!finance) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json(finance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFinance = async (req, res) => {
  try {
    const updatedFinance = await Finance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFinance) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json(updatedFinance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFinance = async (req, res) => {
  try {
    const deletedFinance = await Finance.findByIdAndDelete(req.params.id);
    if (!deletedFinance) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json({ message: "Finance record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAllFinance = async (req, res) => {
  try {
    await Finance.deleteMany({});
    res.json({ message: "All finance records deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
