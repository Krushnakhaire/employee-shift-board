const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  createShift,
  getShifts,
  deleteShift
} = require('../controllers/shiftController');

router.post('/shifts', auth, requireRole('admin'), createShift);

router.get('/shifts', auth, getShifts);

router.delete('/shift/:id', auth, requireRole('admin'), deleteShift);

module.exports = router;
