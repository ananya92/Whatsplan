const passport = require('passport');
const LocalStrategy = require('./localStrategy');
const User = require('../../models/user');

passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ')
	console.log(user) // the whole raw user object!
	console.log('---------')
	done(null, user)
})

passport.deserializeUser((obj, done) => {
	console.log('DeserializeUser called');
	done(null, obj);
})

//  Use Strategies 
passport.use(LocalStrategy);

module.exports = passport;
