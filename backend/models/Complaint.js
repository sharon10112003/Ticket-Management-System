const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    block: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
    roomNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'RoomNumber', required: true },
    complaintType: {
        type: String,
        required: true,
        enum: ['PC Hardware', 'PC Software', 'Application Issues', 'Network', 'Electronics', 'Plumbing', 'Other']
    },
    complaintRemarks: { type: String, required: true },
    complaintAttachment: { type: String }, // Path to file or URL
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In-Progress', 'On-Hold', 'Completed', 'Closed'],
        default: 'Pending'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' } // Auto-filled from user details
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
