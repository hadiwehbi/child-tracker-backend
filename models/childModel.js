const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const childSchema = new mongoose.Schema({
  childName: {
    type: String,
    trim: true,
    required: [true, 'Enter your name!'],
  },
  birthday: {
    type: Date,
    required: [true, 'Enter your child birthday'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  pregnancyDuration: {
    type: Number,
    required: [true, 'Enter your child pregnancy duration in WEEKS'],
    min: 1,
    max: 52,
  },
  gender: {
    type: String,
    required: [true, 'Enter your child gender'],
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not supported',
    },
  },
  data:{
    type: Object,
  },
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // devChecklist: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'devChecklist',
  // },
  // vacChecklist: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'vacChecklist',
  // },
});

// childSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'User',
//   });
//   next();
// });

// childSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'vacChecklist',
//   });
//   next();
// });

// childSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'devChecklist',
//   });
//   next();
// });

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
