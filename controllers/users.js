// Require
const Users = require("../models/users");
const router = require("express").Router();

// Routes
router.post("/signup", (req, res) => {
  Users.find({ email: req.body.email })
    .count()
    .then(number => {
      if (number != 0) {
        res.send("Email already exists");
      } else {
        Users.create(req.body).then(user => {
          res.send(user);
        });
      }
    });
});

router.post("/login", (req, res) => {});

// Export
module.exports = router;
