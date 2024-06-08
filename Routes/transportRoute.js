const express = require('express');
const router = express.Router();
const transportController = require('../Controllers/transportController')

router.post('/add-transport', transportController.createTransportRoute)

router.get('/all', transportController.getAllTransportRoutes)

router.get('/:id', transportController.getTransportRouteById)

router.put('/update/:id', transportController.updateTransportRoute)

router.delete('/delete/:id', transportController.deleteTransportRoute)

router.put('/assign-vehicle', transportController.assignVehicleToTransportRoute)

router.get('/:id/vehicle', transportController.getTransportRouteWithVehicle);

router.put('/assign-driver', transportController.assignDriverToTransportRoute)

router.get('/:id/driver', transportController.getTransportRouteWithDriver)

module.exports = router;