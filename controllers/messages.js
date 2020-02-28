// Require
const Messages = require("../models/messages");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Routes

//define token
//let token = req.headers.authorization.split(" ")[1];
router.post("/", (req, res) => {
  Messages.create(req.body)
    .then(message => {
      let token = req.headers.authorization.split(" ")[1];
      let user = jwt.verify(token, process.env.SECRET);
      //  console.log("user", user);
      message.user = user._id;
      //  console.log("user", message.user);
      res.send(message);
    })
    .catch(err => res.send(err));
});
router.get("/", (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
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
