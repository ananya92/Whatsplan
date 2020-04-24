const db = require("../models");

// Defining methods for the controller
module.exports = {
  registerUser: function(req, res) {
    console.log('user signup');

    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
  },

  login: function(req, res, next){
    res.send(req.user);
  },

  getUser: function(req, res) {
    if (req.user) {
      res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
  },

  logout: function(req, res) {
    if (req.user) {
      req.logout();
      res.send({ msg: 'logging out' });
    } else {
        res.send({ msg: 'no user to log out' });
    }
  }
};
