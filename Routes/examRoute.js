const express = require('express');
const router = express.Router();
const examController = require('../Controllers/examController')


router.post('/add-exam', examController.createExam)

router.get('/all', examController.getAllExams)

router.get('/:id', examController.getExamById)

router.put('/update/:id', examController.updateExam)

router.delete('/delete/:id', examController.deleteExam)

module.exports = router;
