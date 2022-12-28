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

module.exports = { addChild };
// exports.addChild = factory.createOne(Child),
exports.getChild = factory.getOne(Child, { path: 'user' });
exports.updateChild = factory.updateOne(Child);
exports.deleteChild = factory.deleteOne(Child);
