const router = require("express").Router();
const passport = require("../../config/passport");
const User = require("../../models/user");
const Plan = require("../../models/plan");
// Matches with "/api/user"
router.post('/register', (req, res) => {
  console.log('user signup');

  const { firstname, lastname, email, username, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      res.json({
        error: `This email ID already exists as a registered user. Please login to continue.`
      })
    }
    else {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log(err);
        } else if (user) {
          res.json({
            error: `This username is already taken! Please try another.`
          })
        }
        else {
          const newUser = new User({
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            password: password
          })
          newUser.save((err, savedUser) => {
            if (err) return res.json(err)
            res.json(savedUser)
          })
        }
      })
    }
  })
})

router.post(
  '/login',
  function (req, res, next) {
    console.log('req.body: ');
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      console.log('logged in', user, info);

      if(!user) {
        return res.send(info);
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send(user);
      });
    })(req, res, next)
  }
);

router.get('/', (req, res, next) => {
  console.log('===== user!!======')
  console.log(req.user);
  if (req.user) {
    res.json({ user: req.user })
  } else {
    res.json({ user: null })
  }
})

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    console.log("req.user:");
    console.log(req.user);
    res.send({ msg: 'logging out' })
  } else {
    res.send({ msg: 'no user to log out' })
  }
})

router.get('/all', (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      console.log('Get all users error: ', err);
    } 
    else {
      res.json(users);
    }
  })
});

router.get('/getUserByEmail/:email', (req, res) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) {
      console.log(err);
    } 
    else if(user) {
      res.json(user);
    }
    else {
      console.log("No user exists with email id");
    }
  });
});

router.put('/addPlanToUser/:email', (req, res) => {
  User.findOneAndUpdate({ email: req.params.email }, {$push: {plans: req.body.plan_id}}, (err, user) => {
    if (err) {
      console.log(err);
    } 
    else if(user){
      res.json(user);
    }
    else {
      console.log("No user exists with email id");
    }
  });
});

// get all current plans of user with requested email id
router.get('/getCurrentPlans', (req, res) => {
  if(req.user !== null) {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log(err);
      } 
      else if(user) {
        Plan.find({_id : {$in: user.plans}, status : {$nin: "Done"}}, (err, plans) => {
          if (err) {
            console.log(err);
          } 
          else {
            res.json(plans);
          }
        });
      }
      else {
        console.log("No user exists with email id");
      }
    });
  }
})


//Get user by ID
router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
      if (err) {
          console.log(err);
      }
      else if (user) {
          res.json(user);
      }
      else {
          console.log("No user exists with id ", req.params.id);
      }
  });
});

module.exports = router;