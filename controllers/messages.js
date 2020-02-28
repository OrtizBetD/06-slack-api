// Require
const Messages = require("../models/messages");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes
router.post("/", (req, res) => {
  Messages.create(req.body)
    .then(message => {
      let token = req.headers.authorization.split(" ")[1];
      console.log("token", token);
      let user = jwt.verify(token, process.env.SECRET);
      //  console.log("user", user);
      message.user = user._id;
      //  console.log("user", message.user);
      res.send(message);
    })
    .catch(err => res.send(err));
});
router.get("/", (req, res) => {
  Messages.find(req.query)
    .populate("user", "-password")
    .then(messages => {
      res.send(messages);
    })
    .catch(err => res.send(err));
});

// Export
module.exports = router;
