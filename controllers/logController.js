const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Log = require('./../models/logModel');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const { startSession } = require('mongoose');

const addChild = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const newChild = await Child.create([req.body], { session });

		const parent = await User.findOne({ _id: req.body.parentId });

		parent.children.push(newChild[0]._id);

		const saveParent = await parent.save();

		await session.commitTransaction();
		session.endSession();
		console.log('success');
		res.status(201).json({
			status: 'success',
			data: { newChild, saveParent }
		});
	} catch (err) {
		await session.abortTransaction();
		session.endSession();
		console.log('err', err);
		res.status(400).json(err);
	}
};

const addLog = async (req, res) => {
	try {
		const newLog = await Log.create([req.body]);

		res.status(201).json({
			status: 'success',
			data: { newLog }
		});
	} catch (err) {
		console.log('err', err);
		res.status(400).json(err);
	}
};

const getAllLogsByUser = async (req, res) => {
	try {
		const newLog = await Log.create([req.body]);

		res.status(201).json({
			status: 'success',
			data: { newLog }
		});
	} catch (err) {
		console.log('err', err);
		res.status(400).json(err);
	}
};

const getAllLogsForUsers = async (req, res) => {
	try {
		const logs = await Log.aggregate([
			{
			  $group: {
				_id: '$user_id',
				logs: { $push: '$$ROOT' },
			  },
			},
			// {
			//   $lookup: {
			// 	from: 'users', // Use your actual user collection name
			// 	localField: '_id',
			// 	foreignField: '_id',
			// 	as: 'user',
			//   },
			// },
			// {
			//   $unwind: '$user',
			// },
			{
			  $project: {
				_id: 0,
				user: 1,
				logs: 1,
			  },
			},
		  ]);

		//   return logsForUsers;
		res.status(201).json({
			status: 'success',
			logs
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
};

module.exports = { addLog, getAllLogsForUsers };
