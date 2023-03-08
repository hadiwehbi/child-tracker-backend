const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Child = require('./../models/childModel');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
// const { conn, session, abortTransaction } = require('../app');
const { startSession } = require('mongoose');

const addChild = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const newChild = await Child.create([req.body], { session });

		console.log('-------> doc', newChild);
		const parent = await User.findOne({ _id: req.body.parent_id });

		console.log('-------> parent', parent);

		parent.childs.push(newChild._id);

		const saveParent = await parent.save();
		console.log('------->', saveParent);

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

// exports.addChild = factory.createOne(Child),
// const getChild = factory.getOne(Child);
const getChild = async (req, res) => {
	try {
		const child = await Child.findOne({ _id: req.body.id });

		if (!child) {
			return res.status(404).json({
				status: 'fail',
				message: 'Child not found'
			});
		}

		return res.status(201).json({
			status: 'success',
			data: { child }
		});
	} catch (err) {
		console.log('err', err);
		res.status(400).json(err);
	}
};

const updateChild = async (req, res) => {
	try {
		const child = await Child.findOne({ _id: req.body.id });
		if (!child) {
			return res.status(404).json({
				status: 'fail',
				message: 'Child not found'
			});
		}

		const updatedChild = await Child.updateOne({ _id: req.body.id }, req.body.data);

		res.status(200).json({
			status: 'success',
			data: { updatedChild }
		});
	} catch (err) {
		console.log('err', err);
		res.status(400).json(err);
	}
};

// const updateChild = factory.updateOne(Child);
const deleteChild = factory.deleteOne(Child);

module.exports = { addChild, getChild, updateChild, deleteChild };
