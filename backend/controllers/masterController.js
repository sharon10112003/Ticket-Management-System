const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const RoomNumber = require('../models/RoomNumber');
const Role = require('../models/Role');
const User = require('../models/User');

// Generic CRUD handlers
const createOne = (Model) => async (req, res) => {
    try {
        const doc = await Model.create(req.body);
        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAll = (Model, populateOptions) => async (req, res) => {
    try {
        let query = Model.find();
        if (populateOptions) query = query.populate(populateOptions);
        const docs = await query;
        res.status(200).json(docs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateOne = (Model) => async (req, res) => {
    try {
        const doc = await Model.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        Object.assign(doc, req.body);
        await doc.save();

        res.status(200).json(doc);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteOne = (Model) => async (req, res) => {
    try {
        await Model.findByIdAndDelete(req.params.id);
        res.status(204).json(null);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Department
exports.createDepartment = createOne(Department);
exports.getAllDepartments = getAll(Department);
exports.updateDepartment = updateOne(Department);
exports.deleteDepartment = deleteOne(Department);

// Programme
exports.createProgramme = createOne(Programme);
exports.getAllProgrammes = getAll(Programme, 'department');
exports.updateProgramme = updateOne(Programme);
exports.deleteProgramme = deleteOne(Programme);

// Block
exports.createBlock = createOne(Block);
exports.getAllBlocks = getAll(Block, ['department', 'programme']);
exports.updateBlock = updateOne(Block);
exports.deleteBlock = deleteOne(Block);

// RoomNumber
exports.createRoomNumber = createOne(RoomNumber);
exports.getAllRoomNumbers = getAll(RoomNumber, ['department', 'programme', 'block']);
exports.updateRoomNumber = updateOne(RoomNumber);
exports.deleteRoomNumber = deleteOne(RoomNumber);

// Role
exports.createRole = createOne(Role);
exports.getAllRoles = getAll(Role);
exports.updateRole = updateOne(Role);
exports.deleteRole = deleteOne(Role);

// User
exports.createUser = createOne(User);
exports.getAllUsers = getAll(User, 'role');
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
