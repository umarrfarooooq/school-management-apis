const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController')
const { protect } = require('../Middlewares/authMiddleware')
const roleMiddleware = require('../Middlewares/roleMiddleware');

router.post('/add', studentController.createStudent);

router.get('/all', studentController.getAllStudents);

router.get('/student/:id', studentController.getStudentById);

router.put('/update/:id', studentController.updateStudent);

router.delete('/delete/:id', studentController.deleteStudent);

router.put('/add/:id/siblings', studentController.addSibling);

router.put('/:id/attendance', studentController.markAttendance);

router.put('/:id/fees', studentController.addOrUpdateFees);

router.put('/:id/fees/paid', studentController.markFeePaid);


module.exports = router;