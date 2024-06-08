const express = require('express');
const router = express.Router();
const studentTransportController = require('../Controllers/studentTransportController')

router.post('/assign', studentTransportController.assignStudentToTransportRoute)

router.get('/all', studentTransportController.getAllStudentTransportAssignments)

router.get('/:id', studentTransportController.getStudentTransportAssignmentById)

router.put('/update/:id', studentTransportController.updateStudentTransportAssignment)

router.delete('/delete/:id', studentTransportController.deleteStudentTransportAssignment)

module.exports = router;