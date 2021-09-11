const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateSignupData, validateLoginData } = require("../util/validator");
exports.signup = (req, res) => {
    const user = {
      phone: req.body.phone,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      userType: req.body.userType
    };

    const { valid, errors } = validateSignupData(user);
    if (!valid) return res.status(400).json(errors);

    User.findOne({ phone: user.phone })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(400).json({ error: "Phone Number already exist" });
        }
        bcrypt
          .hash(user.password, 12)
          .then((hashedpassword) => {
            const newUser = new User({
              phone: user.phone,
              password: hashedpassword,
              userType: user.userType
            });
            newUser
              .save()
              .then((user) => {
                let secret = Buffer.from(process.env.SECRETE_KEY, "base64");
                jwt.sign(
                  { _id: user._id },
                  secret,
                  { expiresIn: "620h" },
                  (err, idToken) => {
                    if (!err) {
                      const { _id, phone, userType } = user;
                      return res.status(201).json({
                        idToken,
                        user: {
                          _id,
                          phone,
                          userType,
                        },
                      });
                    } else {
                      return res
                        .status(500)
                        .json({ general: "Something Went Wrong" });
                    }
                  }
                );
              })
              .catch((e) => {
                console.log(e, "saving error");
              });
          })
          .catch((e) => {
            console.log(e, "hashing error");
          });
      })
      .catch((e) => {
          console.log(e);
        return res.status(500).json( e );
      });
};
exports.login = (req, res) => {
  const user = {
    phone: req.body.phone,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  User.findOne({ phone: user.phone })
    .then((savedUser) => {
      if (!savedUser) return res.status(422).json({ error: "User not found" });

      bcrypt
        .compare(user.password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            let secret = Buffer.from(process.env.SECRETE_KEY, "base64");
            jwt.sign(
              { _id: savedUser._id },
              secret,
              { expiresIn: "620h" },
              (err, idToken) => {
                if (!err) {
                  const { _id, phone, userType } = savedUser;
                  return res.status(200).json({
                    idToken,
                    user: {
                      _id,
                      phone,
                      userType,
                    },
                  });
                } else {
                  return res.status(422).json(err);
                }
              }
            );
          } else {
            return res.status(422).json({ error: "Wrong credentials" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      return res.status(422).json({ error: e });
    });
};
