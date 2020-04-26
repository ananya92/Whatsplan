const User = require('../../models/user');
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		console.log("Reached here local strategy", username, password);
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, {status: "error", message: 'Incorrect username' })
			}
			if (!user.checkPassword(password)) {
				return done(null, false, {status: "error", message: 'Incorrect password' })
			}
			return done(null, user);
		})
	}
)

module.exports = strategy;
