const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/check-auth");
const extractImage = require("../middleware/image");

const eventController = require("../controllers/events");


router.post("", CheckAuth, extractImage , eventController.createEvent);


router.put("/:id", CheckAuth, extractImage ,eventController.updateEvent)


router.get('' , CheckAuth, eventController.getEvents);

router.get('/:id',CheckAuth, eventController.getOneEvent);


router.delete('/:id' , CheckAuth, eventController.deleteEvent);



module.exports = router;
