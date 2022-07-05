const mongoose = require('mongoose');
const validator = require('validator');

const vacCheckListSchema = new mongoose.Schema({
  childName: {
    type: String,
    trim: true,
    required: [true, 'Enter your name!']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  questions:{
    type: Array,
  }
});



const Vaccination = mongoose.model('Vaccination', vacCheckListSchema);

module.exports = Vaccination;