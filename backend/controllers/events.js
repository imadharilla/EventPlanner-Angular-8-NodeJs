const express = require("express")
const Event = require('../models/event');



exports.createEvent = (req, res, next) => {

  let eventJs = req.body.jsonEvent;
  eventJs = JSON.parse(eventJs);
  const url = req.protocol + '://' + req.get("host");
  const event = new Event(
    {
      title : eventJs.title,
      imagePath: url + "/images/" + req.file.filename,
      description : eventJs.description,
      startDate : eventJs.startDate,
      endDate : eventJs.endDate,
      location : eventJs.location,
      creator: req.userData.userId,
    }
  );
  try {
    event.save().then((result)=>{
      res.status(201).json({
        message : "Post Added Successfully",
        eventId: result._id,
        url : result.imagePath,
      });
    });
  } catch (error) {
    console.log("unable to save event to database : " + error);
  }
}


exports.updateEvent = (req, res, next) => {

  let event;
  if( req.file ){


    let eventData = JSON.parse( req.body.jsonEvent);
    event = new Event({
      _id : eventData.id,
      title : eventData.title,
      imagePath : req.protocol + '://' + req.get("host") + "/images/" + req.file.filename,
      description : eventData.description,
      startDate : eventData.startDate,
      endDate : eventData.endDate,
      location : eventData.location,
      creator: req.userData.userId,
    })
  }else{
    event = new Event({
      _id : req.params.id,
      title : req.body.title,
      imagePath : req.body.imagePath,
      description : req.body.description,
      startDate : req.body.startDate,
      endDate : req.body.endDate,
      location : req.body.location,
      creator: req.userData.userId,

    })
  }

  Event.updateOne({_id: req.params.id}, event)
  .then((result) => {

      res.status(200).json({message: "update Successful", imagePath: event.imagePath});

    });
}


exports.getEvents = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const eventQuery = Event.find({creator: req.userData.userId});

  let fetchedEvents;
  if (pageSize !==null && currentPage  !==null) {
    eventQuery
      .skip(pageSize * (currentPage))
      .limit(pageSize);
  }

  eventQuery.then((documents) => {
    fetchedEvents = documents;
    return eventQuery.countDocuments();

  }).then(count => {
    res.status(200).json({
      message: 'Events fetched succesfully lol !',
      events :  fetchedEvents,
      maxEvents: count
    });
  }).catch(error => {
    res.status(500).json({
      message : "Unable to fetch Events!"
    })
  });
}

exports.getOneEvent = (req, res, next) => {
  Event.findById(req.params.id).then(event => {
    if(event) {
      res.status(200).json(event);
    }
    else {
      res.status(404).json({message: 'Event Not Found'});
    }
  });
}


exports.deleteEvent = (req, res, next) => {
  Event.deleteOne({_id : req.params.id})
    .then(result => {

      res.status(200).json({ message: "Event deleted !"});

    })
}
