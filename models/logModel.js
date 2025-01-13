const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		action: {
			type: String,
			required: [true, 'Log action is required']
		},
		description: {
			type: String,
			required: [true, 'Log description is required']
		},
		takenAt: {
			type: Date,
			required: [true, 'Date is required']
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
