// Require
const Channels = require("../models/channels");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes
router.post("/", (req, res) => {
  Channels.create(req.body)
    .then(channel => {
      let token = req.headers.authorization.split(" ")[1];
      let channel_token = jwt.verify(token, process.env.SECRET);
      if (channel_token) {
        res.send(channel);
      }
    })
    .catch(err => res.send("not authorized"));
});
router.get("/", (req, res) => {
  Channels.find(req.query)
    .then(channels => {
      let token = req.headers.authorization.split(" ")[1];
      let channel_info = jwt.verify(token, process.env.SECRET);
      if (channel_info) {
        res.send(channels);
      }
    })
    .catch(err => res.send("not authorized"));
});

// Export
module.exports = router;
