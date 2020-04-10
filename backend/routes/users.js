const express = require("express");

const router = express.Router();
const UserControler = require('../controllers/user');

router.post("/signup", UserControler.createUser);


router.post("/login", UserControler.userLogin)


module.exports = router;
