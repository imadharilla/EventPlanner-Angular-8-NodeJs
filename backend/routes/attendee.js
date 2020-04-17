const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/check-auth");

const Attendee = require("../models/attendee");

const gmailService = require('../services/gmailAPI');



router.get("", CheckAuth, (req, res, next) => {

   Attendee.find({ownerId:req.userData.userId}).then(attendeeQuery => {
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
    ownerId : req.userData.userId,
  });

  let message = "<p>Bonjour " + attendee.prenom + ", <br><br>Merci de vous être inscrit sur EMIEvent!<br>Bienvenue sur notre plateforme de gestion d'événements<br>Visitez notre site : https://inchaalah.com/ pour en savoir plus sur nos fonctionnalités.<br>Si vous avez des questions,mettez les en réponse à cet email—nous sommes là pour vous aider.<br><br>Cordialement,<br>L'Equipe EMIEvent.</p>"
  let subject = "Votre compte EMIEvent a ete cree!"
  gmailService.sendEmail(attendee.email, subject, message);


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
