const express = require('express');
const router = express.Router();
const feeController = require('../Controllers/feeController')

router.post('/create', feeController.createFee)

router.get('/all', feeController.getAllFees)

router.get('/:id', feeController.getFeeById)

router.put('/update/:id' , feeController.updateFee)

router.delete('/delete/:id', feeController.deleteFee)

router.put('/paid/:id/fee', feeController.markFeePaid)

router.put('/discount-apply/:id', feeController.applyDiscount)

module.exports = router;
