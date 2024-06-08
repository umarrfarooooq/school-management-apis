const express = require('express');
const router = express.Router();
const subjectController = require('../Controllers/subjectController')

router.post('/create', subjectController.createSubject)

router.get('/all', subjectController.getAllSubjects)

router.get('/:id', subjectController.getSubjectById)

router.put('/update/:id', subjectController.updateSubject)

router.delete('/delete/:id', subjectController.deleteSubject)

module.exports = router;