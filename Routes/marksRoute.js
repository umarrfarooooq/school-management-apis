const express = require('express');
const router = express.Router();
const marksController = require('../Controllers/marksController')


router.post('/add-marks', marksController.addMarks)

router.get('/all', marksController.getAllMarks)

router.get('/examId/:id', marksController.getMarksByExamId)

router.get('/studentId/:id', marksController.getMarksByStudentId)

router.put('/update/:id', marksController.updateMarks)

router.delete('/delete/:id', marksController.deleteMarks)

module.exports = router;
