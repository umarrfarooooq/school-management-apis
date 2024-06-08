const express = require('express');
const router = express.Router();
const bookController = require('../Controllers/bookController')

router.post('/add', bookController.createBook)

router.get('/all', bookController.getAllBooks)

router.get('/:id', bookController.getBookById)

router.put('/update/:id', bookController.updateBook)

router.delete('/delete/:id', bookController.deleteBook)

router.post('/issue', bookController.issueBook)

router.post('/return', bookController.returnBook)

module.exports = router;