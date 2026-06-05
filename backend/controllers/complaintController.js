const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.createComplaint = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const complaintData = {
            ...req.body,
            raisedBy: req.user.id,
        };

        // Assign department only if it's a valid ObjectId (defensive)
        if (user.department && mongoose.Types.ObjectId.isValid(user.department)) {
            complaintData.department = user.department;
        }

        const complaint = await Complaint.create(complaintData);
        res.status(201).json(complaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ raisedBy: req.user.id })
            .populate('block roomNumber department');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        let query = {};

        // RBAC filtering
        if (req.user.role === 'User') {
            query.raisedBy = req.user.id;
        } else if (req.user.role === 'SuperAdmin') {
            if (req.query.department) query.department = req.query.department;
        } else {
            // Technician/Staff - usually see complaints in their department or assigned to them
            // For now, let's assume they see all assigned to them
            query.assignedTo = req.user.id;
        }

        const complaints = await Complaint.find(query)
            .populate('block roomNumber raisedBy assignedTo department')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'User') {
            query.raisedBy = req.user.id;
        }

        const stats = await Complaint.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            total: 0,
            pending: 0,
            assigned: 0,
            inProgress: 0,
            onHold: 0,
            completed: 0,
            closed: 0
        };

        stats.forEach(item => {
            const statusKey = item._id.charAt(0).toLowerCase() + item._id.slice(1).replace('-', '');
            formattedStats[statusKey] = item.count;
            formattedStats.total += item.count;
        });

        res.json(formattedStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        // Logic check for status updates
        const allowedTransitions = {
            'Pending': ['Assigned'],
            'Assigned': ['In-Progress', 'On-Hold'],
            'In-Progress': ['Completed', 'On-Hold'],
            'On-Hold': ['In-Progress', 'Completed'],
            'Completed': ['Closed']
        };

        if (req.user.role !== 'SuperAdmin') {
            if (!allowedTransitions[complaint.status]?.includes(status)) {
                return res.status(400).json({
                    message: `Invalid status transition from ${complaint.status} to ${status}`
                });
            }
        }

        complaint.status = status;
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.assignComplaint = async (req, res) => {
    try {
        const { assignedTo } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        // Superadmin can assign and reassign BEFORE staff changes status (Pending or Assigned)
        if (complaint.status !== 'Pending' && complaint.status !== 'Assigned' && req.user.role !== 'SuperAdmin') {
            return res.status(400).json({ message: 'Cannot assign once work has started' });
        }

        complaint.assignedTo = assignedTo;
        complaint.status = 'Assigned';
        await complaint.save();
        res.json(complaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const { department, programme, complaintType, status, assignedTo } = req.query;
        let query = {};

        if (department) query.department = department;
        if (programme) query.programme = programme;
        if (complaintType) query.complaintType = complaintType;
        if (status) query.status = status;
        if (assignedTo) query.assignedTo = assignedTo;

        const complaints = await Complaint.find(query)
            .populate('block roomNumber raisedBy assignedTo department')
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
