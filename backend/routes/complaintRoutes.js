const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', restrictTo('User', 'SuperAdmin'), complaintController.createComplaint);
router.get('/my', complaintController.getMyComplaints);
router.get('/all', complaintController.getAllComplaints);
router.get('/stats', complaintController.getDashboardStats);
router.get('/report', restrictTo('SuperAdmin'), complaintController.getReport);
router.put('/:id/status', restrictTo('SuperAdmin', 'Networking Staff', 'Plumber', 'Electrician', 'Software Developer'), complaintController.updateComplaintStatus);
router.put('/:id/assign', restrictTo('SuperAdmin'), complaintController.assignComplaint);

module.exports = router;
