// Require
const Messages = require("../models/messages");
const router = require("express").Router();

// Routes
router.post("/", (req, res) => {
  Messages.create(req.body)
    .then(message => {
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
