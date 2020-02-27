// Require
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes
router.post("/signup", (req, res) => {
  Users.findOne({ email: req.body.email })
    .count()
    .then(number => {
      if (number != 0) {
        res.send("Email already exists");
      } else {
        let encrypted = bcrypt.hashSync(req.body.password, 10);
        req.body.password = encrypted;
        Users.create(req.body).then(user => {
          let plain_user = user.toObject();
          let token = jwt.sign(plain_user, process.env.SECRET);
          res.send(token);
        });
      }
    });
});

router.post("/login", (req, res) => {});

// Export
module.exports = router;
