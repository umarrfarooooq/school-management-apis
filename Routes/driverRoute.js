const express = require('express');
const router = express.Router();
const driverController = require('../Controllers/driverController')

router.post('/add', driverController.createDriver)

router.get('/all', driverController.getAllDrivers)

router.get('/:id', driverController.getDriverById)

router.put('/update/:id', driverController.updateDriver)

router.delete('/delete/:id', driverController.deleteDriver)

module.exports = router;
