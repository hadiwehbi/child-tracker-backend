const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Child = require('./../models/childModel');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

exports.addChild = factory.createOne(Child),
exports.getChild = factory.getOne(Child, { path: 'user' });
exports.updateChild = factory.updateOne(Child);
exports.deleteChild = factory.deleteOne(Child);

