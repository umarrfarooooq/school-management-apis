const TransportRoute = require('../Models/transportRoute');

exports.createTransportRoute = async (req, res) => {
  try {
    const { name, description, stops, vehicle, driver } = req.body;

    const newTransportRoute = new TransportRoute({
      name,
      description,
      stops,
      vehicle,
      driver,
    });

    const savedTransportRoute = await newTransportRoute.save();
    res.status(201).json(savedTransportRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTransportRoutes = async (req, res) => {
  try {
    const transportRoutes = await TransportRoute.find().populate('vehicle').populate('driver');
    res.json(transportRoutes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransportRouteById = async (req, res) => {
  try {
    const transportRoute = await TransportRoute.findById(req.params.id).populate('vehicle').populate('driver');
    if (!transportRoute) {
      return res.status(404).json({ error: 'Transport route not found' });
    }
    res.json(transportRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransportRoute = async (req, res) => {
  try {
    const updatedTransportRoute = await TransportRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTransportRoute) {
      return res.status(404).json({ error: 'Transport route not found' });
    }
    res.json(updatedTransportRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTransportRoute = async (req, res) => {
  try {
    const deletedTransportRoute = await TransportRoute.findByIdAndDelete(req.params.id);
    if (!deletedTransportRoute) {
      return res.status(404).json({ error: 'Transport route not found' });
    }
    res.json({ message: 'Transport route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.assignVehicleToTransportRoute = async (req, res) => {
  try {
    const { transportRoute, vehicle } = req.body;

    const updatedTransportRoute = await TransportRoute.findByIdAndUpdate(
      transportRoute,
      { vehicle },
      { new: true }
    ).populate("vehicle");

    if (!updatedTransportRoute) {
      return res.status(404).json({ error: "Transport route not found" });
    }

    res.json(updatedTransportRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransportRouteWithVehicle = async (req, res) => {
  try {
    const transportRouteId = req.params.id;

    const transportRoute = await TransportRoute.findById(
      transportRouteId
    ).populate("vehicle");

    if (!transportRoute) {
      return res.status(404).json({ error: "Transport route not found" });
    }

    res.json(transportRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignDriverToTransportRoute = async (req, res) => {
  try {
    const { transportRoute, driver } = req.body;

    const updatedTransportRoute = await TransportRoute.findByIdAndUpdate(
      transportRoute,
      { driver },
      { new: true }
    ).populate("driver");

    if (!updatedTransportRoute) {
      return res.status(404).json({ error: "Transport route not found" });
    }

    res.json(updatedTransportRoute);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransportRouteWithDriver = async (req, res) => {
  try {
    const transportRouteId = req.params.id;

    const transportRoute = await TransportRoute.findById(
      transportRouteId
    ).populate("driver");

    if (!transportRoute) {
      return res.status(404).json({ error: "Transport route not found" });
    }

    res.json(transportRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
