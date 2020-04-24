const router = require("express").Router();
const controller = require("../../controllers/controller");
const passport = require("../../config/passport");
const User = require("../../models/user");

// Matches with "/api/user"
router.post('/register', (req, res) => {
  console.log('user signup');

  const { username, password } = req.body
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
})

router.post(
  '/login',
  function (req, res, next) {
    console.log('req.body: ');
    console.log(req.body)
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      console.log('logged in', user, info);

      if(!user) {
        return res.send(info);
      }
      
      var userInfo = {
        username: user.username
      };
      return res.send(userInfo);
    })(req, res, next)
  }
);

router.get('/', (req, res, next) => {
  console.log('===== user!!======')
  console.log(req.user)
  if (req.user) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
})

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout()
    res.send({ msg: 'logging out' })
  } else {
    res.send({ msg: 'no user to log out' })
  }
})

module.exports = router;