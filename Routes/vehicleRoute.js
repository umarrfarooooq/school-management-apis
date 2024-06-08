const express = require('express');
const router = express.Router();
const vehicleController = require('../Controllers/vehicleController')

router.post('/add', vehicleController.createVehicle)

router.get('/all', vehicleController.getAllVehicles)

router.get('/:id', vehicleController.getVehicleById)

router.put('/update/:id', vehicleController.updateVehicle)

router.delete('/delete/:id', vehicleController.deleteVehicle)

module.exports = router;