// Require
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// Routes
router.post("/signup", (req, res) => {
  Users.find({ email: req.body.email })
    .count()
    .then(number => {
      if (number != 0) {
        res.send("Email already exists");
      } else {
        let encrypted = bcrypt.hashSync(req.body.password, 10);
        req.body.password = encrypted;
        Users.create(req.body).then(user => {
          res.send(user);
        });
      }
    });
});

router.post("/login", (req, res) => {});

// Export
module.exports = router;
