const mongoose = require('mongoose');

const attendeeSchema = mongoose.Schema({

  email: {type: String, required:true},
  nom: {type:String, required: true },
  prenom : {type:String, required: false},
  occupation : {type: String, required:true},

});

module.exports = mongoose.model('Attendee', attendeeSchema);

