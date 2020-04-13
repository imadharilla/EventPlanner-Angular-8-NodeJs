const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/check-auth");

const Attendee = require("../models/attendee");
router.get("", CheckAuth, (req, res, next) => {

   Attendee.find().then(attendeeQuery => {
    res.status(200).json({
      message: 'attendeeList fetched successfully!',
      attendeeList : attendeeQuery
    })
   })

})

router.post("", CheckAuth, (req, res, next) => {

  let attendeeJs = req.body;
  //attendeeJs = JSON.parse(attendeeJs);
  let attendee =  Attendee({
    email : attendeeJs.email,
    nom : attendeeJs.nom,
    prenom : attendeeJs.prenom,
    occupation : attendeeJs.occupation,
  });

  attendee.save()
    .then( rslt => {
      res.status(201).json({
        attendee : rslt,
        message: "Attendee created successfully!",
      });
    }).catch(error=> {
      res.status(500).json({
        message: "Cannot create attendee"
      });
    })
})


router.delete('/:id', CheckAuth, (req, res, next) => {
  Attendee.deleteOne({_id : req.params.id})
    .then(result => {
      res.status(200).json({ message: "Attendee deleted Successfully !"});

    })
})


module.exports = router;
