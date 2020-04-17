const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user")

exports.createUser =  (req, res, next) => {
  let user;
  bcrypt.hash(req.body.authData.password, 9)
    .then(hash => {
       user = new User({
         nom : req.body.nom,
         prenom : req.body.prenom,
        email: req.body.authData.email,
        password: hash,
      })
      user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created successfully! ',
          result: result,
        });
      })
      .catch(err => {
        res.status(500).json({
          message :"This email is already taken!"
        });
      });
    });
}


exports.userLogin =  (req, res, next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }

    }).then(result => {
      if(!result){
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }

      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
         'secret_aimad_bajbsayasuygsaygxhvxygaihas',
          {expiresIn:'1h',});
      res.status(200).json({
        token: token,
        expiresIn : 3600,
      });

    }).catch(err=>{
      console.log(err);
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
