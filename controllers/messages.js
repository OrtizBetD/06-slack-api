// Require
const Messages = require("../models/messages");
const Users = require("../models/users");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
//SETTING STORAGE type
const upload = multer({ storage: multer.memoryStorage() });

const DataUri = require("datauri");
const path = require("path");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// Routes
// upload.single("file"),
//define token
//let token = req.headers.authorization.split(" ")[1];
router.post("/", upload.single("file"), (req, res) => {
  //console.log("file>>", req.file);
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRET, (err, token_data) => {
    if (token_data) {
      if (req.file) {
        const dataUri = new DataUri();
        let uri = dataUri.format(
          path.extname(req.file.originalname).toString(),
          req.file.buffer
        ).content;

        cloudinary.uploader.upload(uri).then(cloudinaryFile => {
          req.body.file = cloudinaryFile.url;
          Users.findById(token_data._id).then(user => {
            if (user.password == token_data.password) {
              req.body.user = user._id;
              Messages.create(req.body).then(message => {
                console.log("token_mes", token);
                let user = jwt.verify(token, process.env.SECRET);
                //  console.log("user", user);
                message.user = user._id;
                //  console.log("user", message.user);
                Messages.findById(message._id)
                  .populate("user", "-password")
                  .then(messages => {
                    res.send(messages);
                  })
                  .catch(err => res.send(err));
              });
            }
          });
        });
      } else {
        Users.findById(token_data._id).then(user => {
          if (user.password == token_data.password) {
            req.body.user = user._id;
            Messages.create(req.body).then(message => {
              console.log("token_mes", token);
              let user = jwt.verify(token, process.env.SECRET);
              //  console.log("user", user);
              message.user = user._id;
              //  console.log("user", message.user);
              Messages.findById(message._id)
                .populate("user", "-password")
                .then(messages => {
                  res.send(messages);
                })
                .catch(err => res.send(err));
            });
          }
        });
      }
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
