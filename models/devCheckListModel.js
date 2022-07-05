const mongoose = require('mongoose');
const validator = require('validator');

const devCheckListSchema = new mongoose.Schema({
  childName: {
    type: String,
    trim: true,
    required: [true, 'Enter your name!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // ...
});



const Development = mongoose.model('Development', devCheckListSchema);

module.exports = Development;


