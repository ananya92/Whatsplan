const User = require('../../models/user');
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		console.log("Reached here local strategy", username, password);
		User.find({},(err, users) => {
			console.log("Reached here findAll error", err, users);
		});
		User.findOne({ username: username }, (err, user) => {
			console.log("Reached here err", err);
			if (err) {
				return done(err)
			}
			console.log("Reached here user", user);
			if (!user) {
				return done(null, false, {status: "error", message: 'Incorrect username' })
			}
			console.log("Reached here local strategy", user.checkPassword(password));
			if (!user.checkPassword(password)) {
				return done(null, false, {status: "error", message: 'Incorrect password' })
			}
			return done(null, user)
		})
	}
)

module.exports = strategy
