const express = require('express');
const router = express.Router();
const sectionController = require('../Controllers/sectionController')

router.post('/add', sectionController.createSection);

router.get('/all', sectionController.getAllSections);

router.get('/section/:id', sectionController.getSectionById);

router.put('/update/:id', sectionController.updateSection);

router.delete('/delete/:id', sectionController.deleteSection);

module.exports = router;
