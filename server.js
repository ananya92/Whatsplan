const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./routes");
var session = require("express-session");
var bodyParser = require('body-parser');

// Requiring passport as we've configured it
var passport = require("./config/passport");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session - We need to use sessions to keep track of our user's login status
app.use(session({
  secret: "keyboard user",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
  // ,
  // store: new MongoStore({
  //   mongooseConnection: mongoose.connection,
  //   ttl: 24 * 60 * 60 // Keeps session open for 1 day
  // })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/whatsplanDb");
mongoose.set('useFindAndModify', false);
app.listen(PORT, function () {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
