const Driver = require("../Models/Driver");

exports.createDriver = async (req, res) => {
  try {
    const { user, licenseNumber, expiryDate } = req.body;

    const newDriver = new Driver({
      user,
      licenseNumber,
      expiryDate,
    });

    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("user", "name");
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate(
      "user",
      "name"
    );
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(updatedDriver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
    if (!deletedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
