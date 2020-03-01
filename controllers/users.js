// Require
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes
router.post("/signup", (req, res) => {
  Users.findOne({ email: req.body.email })
    .then(user => {
      //  console.log("bodyemail", req.body.name);
      console.log(user);
      if (user) {
        res.send("Email already exists");
      } else {
        if (!req.body.name || !req.body.email || !req.body.password) {
          res.send("All fields are required");
        }
        let encrypted = bcrypt.hashSync(req.body.password, 10);
        req.body.password = encrypted;
        Users.create(req.body).then(user => {
          let plain_user = user.toObject();
          let token = jwt.sign(plain_user, process.env.SECRET);
          console.log(token);
          res.send(token);
        });
      }
    })
    .catch(err => console.log(err));
});

router.post("/login", (req, res) => {
  Users.findOne({ email: req.body.email })
    .then(user => {
      if (!req.body.email || !req.body.password) {
        res.send("All fields are required");
      } else if (!user) {
        res.send("email not found");
      } else {
        let match = bcrypt.compareSync(req.body.password, user.password);
        if (match) {
          let plain_user = user.toObject();
          let token = jwt.sign(plain_user, process.env.SECRET);
          console.log(token);
          res.send(token);
        } else {
          res.send("invalid password");
        }
      }
    })
    .catch(err => console.log(err));
});

// Export
module.exports = router;
