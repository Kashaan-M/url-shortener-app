const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original: {
    type: String,
    /*   match: [/((http|https):\/\/)/g, 'Please provide valid url'], */
    required: [true, 'Please provide url'],
  },
  short: {
    type: String,
    minlength: 1,
    maxlength: 6,
  },
});

module.exports = mongoose.model('Url', urlSchema);
