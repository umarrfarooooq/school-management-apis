const express = require('express');
const router = express.Router();
const financeController = require('../Controllers/financeController');

router.post('/add', financeController.createFinance);
router.get('/all-finance', financeController.getAllFinance);
router.get('/:id', financeController.getFinanceById);
router.put('/:id', financeController.updateFinance);
router.delete('/:id', financeController.deleteFinance);
router.delete('/all', financeController.deleteAllFinance);

module.exports = router;