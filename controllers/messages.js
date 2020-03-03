// Require
const Messages = require("../models/messages");
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
//SETTING STORAGE type
const upload = multer({ storage: multer.memoryStorage() });

const DataUri = require("datauri");
const path = require("path");

const cloudinary = require("cloudinary");

// Routes

//define token
//let token = req.headers.authorization.split(" ")[1];
router.post("/", (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let data = jwt.verify(token, process.env.SECRET);
  Users.findById(data._id).then(user => {
    if (user.password == data.password) {
      req.body.user = user._id;
      Messages.create(req.body)
        .then(message => {
          console.log("token_mes", token);
          let user = jwt.verify(token, process.env.SECRET);
          //  console.log("user", user);
          message.user = user._id;
          //  console.log("user", message.user);
          res.send(message);
        })
        .catch(err => res.send(err));
    } else {
      res.send("not authorized");
    }
  });
});
router.get("/", (req, res) => {
  console.log("headers", req.headers.authorization);
  let token = req.headers.authorization.split(" ")[1];
  /*  let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTU4YWViNWRiYWUzMzQ5ODgwMjI4MDkiLCJuYW1lIjoiU3RlZmFubyIsImVtYWlsIjoic2lsdkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRmejJzSzM2MGdKWkZVL29LZGxUL2FlbzFNYi5yUkkzUzdGS0dsc1d2Y2JBcER3dEhjOVZEUyIsIl9fdiI6MCwiaWF0IjoxNTgyODcwMTk3fQ.C4bZlkH_UwaAP3PzhLkbqZbV5hKpgPEuc7CAkqR4QCg";*/
  console.log("token", token);
  jwt.verify(token, process.env.SECRET, (err, token_data) => {
    console.log(token_data);
    if (token_data) {
      Messages.find(req.query)
        .populate("user", "-password")
        .then(messages => {
          /*let token = req.headers.authorization.split(" ")[1];
	      let message_info = jwt.verify(token, process.env.SECRET);*/
          res.send(messages);
        })
        .catch(err => res.send(err));
    } else {
      res.send({ message: "not authorized" });
    }
  });
});

/*Messages.find(req.query)
    .populate("user", "-password")
    .then(messages => {
      /*let token = req.headers.authorization.split(" ")[1];
      let message_info = jwt.verify(token, process.env.SECRET);*/
/*  if (message_info) {
        res.send(messages);
      }
    })
    .catch(err => res.send("not authorized"));*/

// Export
module.exports = router;
