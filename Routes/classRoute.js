const express = require('express');
const router = express.Router();
const classController = require('../Controllers/classController')


router.post('/add', classController.createClass);

router.get('/all', classController.getAllClasses);

router.get('/class/:id', classController.getClassById);

router.put('/update/:id', classController.updateClass);

router.delete('/delete/:id', classController.deleteClass);

module.exports = router;