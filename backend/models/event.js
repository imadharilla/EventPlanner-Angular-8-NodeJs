const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({

  title: {type: String, required:true},
  imagePath: {type:String, required: true },
  description : {type:String, required: false},
  startDate : {type:Date , required:true},
  endDate : {type:Date , required:true},
  location : {type: String, required:true},
  creator : { type: mongoose.Schema.Types.ObjectId, ref:'User' ,required: true},
});

module.exports = mongoose.model('Event', eventSchema);

