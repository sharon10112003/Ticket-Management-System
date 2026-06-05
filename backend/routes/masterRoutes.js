const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

// All master routes protected for authenticated users
router.use(authMiddleware);

// Middleware to restrict non-GET routes to SuperAdmin
const restrictMutationToAdmin = (req, res, next) => {
    if (req.method !== 'GET') {
        return restrictTo('SuperAdmin')(req, res, next);
    }
    next();
};

router.use(restrictMutationToAdmin);

// Department
router.route('/departments')
    .post(masterController.createDepartment)
    .get(masterController.getAllDepartments);
router.route('/departments/:id')
    .put(masterController.updateDepartment)
    .delete(masterController.deleteDepartment);

// Programme
router.route('/programmes')
    .post(masterController.createProgramme)
    .get(masterController.getAllProgrammes);
router.route('/programmes/:id')
    .put(masterController.updateProgramme)
    .delete(masterController.deleteProgramme);

// Block
router.route('/blocks')
    .post(masterController.createBlock)
    .get(masterController.getAllBlocks);
router.route('/blocks/:id')
    .put(masterController.updateBlock)
    .delete(masterController.deleteBlock);

// RoomNumber
router.route('/rooms')
    .post(masterController.createRoomNumber)
    .get(masterController.getAllRoomNumbers);
router.route('/rooms/:id')
    .put(masterController.updateRoomNumber)
    .delete(masterController.deleteRoomNumber);

// Role
router.route('/roles')
    .post(masterController.createRole)
    .get(masterController.getAllRoles);
router.route('/roles/:id')
    .put(masterController.updateRole)
    .delete(masterController.deleteRole);

// User
router.route('/users')
    .post(masterController.createUser)
    .get(masterController.getAllUsers);
router.route('/users/:id')
    .put(masterController.updateUser)
    .delete(masterController.deleteUser);

module.exports = router;
