// config/passport.js

// load all the things we need
var LocalStrategy   	= require('passport-local').Strategy;
var FacebookStrategy	= require('passport-facebook').Strategy;
var GoogleStrategy		= require('passport-google-oauth').OAuth2Strategy;
var InstagramStrategy	= require('passport-instagram').Strategy;

// load up the user model
var User            = require('../app/models/user');
var configAuth		= require('./auth.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // serialize user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP ============================================================

    passport.use('local-signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
			}, function(req, email, password, done) {process.nextTick(function(){
				User.findOne({ 'local.email' :  email }, function(err, user) {
					if (err)
						return done(err);
					if (user) {
						return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
					} else {
						if (!req.user){
							var newUser             = new User();

							newUser.name			= req.body.name;
							newUser.local.name		= req.body.name;
							newUser.local.email    	= email;
							newUser.local.password 	= newUser.generateHash(password);

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						} else {
							var user				= req.user;
							
							if (!user.name)
								user.name		= req.body.name;
							user.local.name		= req.body.name;
							user.local.email	= email;
							user.local.password	= user.generateHash(password);

							user.save(function(err) {
								if (err)
									throw err;
								return done(null, user);
							});
						}
					}
				});    
			});
		}));


    // LOCAL LOGIN =============================================================

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, email, password, done) {
		User.findOne({ 'local.email' : email }, function(err, user){
			if (err)
				return done(err);
			if (!user)
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password or email.'));
			if(!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password or email.'));
			
			return done(null, user);
		});
	}));
	
	// FACEBOOK ================================================================
	passport.use(new FacebookStrategy({

			clientID        	: configAuth.facebookAuth.clientID,
			clientSecret    	: configAuth.facebookAuth.clientSecret,
			callbackURL     	: configAuth.facebookAuth.callbackURL,
			passReqToCallback 	: true,
			profileFields		: ['emails','displayName', 'name']
		},
		function(req, token, refreshToken, profile, done) {
			process.nextTick(function() {
				if (!req.user) {
					User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
						if (err)
							return done(err);
						if (user) {
							return done(null, user);
						} else {
							var newUser            	= new User();
							newUser.name			= profile.displayName;
							newUser.facebook.id    	= profile.id;                 
							newUser.facebook.token 	= token;                  
							newUser.facebook.name  	= profile.displayName;
							newUser.facebook.email 	= profile.emails[0].value;

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}

					});

				} else {
					var user            = req.user;
					
					if(!user.name)
						user.name		= profile.displayName;
					
					user.facebook.id    = profile.id;
					user.facebook.token = token;
					user.facebook.name  = profile.displayName;
					user.facebook.email = profile.emails[0].value;
					
					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				}

			});

		}
	));
	
	// GOOGLE ==================================================================
	passport.use(new GoogleStrategy({
			clientID			: configAuth.googleAuth.clientID,
			clientSecret		: configAuth.googleAuth.clientSecret,
			callbackURL			: configAuth.googleAuth.callbackURL,
			passReqToCallback 	: true
		},
		function(req, token, refreshToken, profile, done) {
			if (!req.user) {
				User.findOne({ 'google.id' : profile.id }, function(err, user) {
					if (err)
						return done(err);
					if (user) {
						return done(null, user);
					} else {
						var newUser				= new User();
						
						newUser.name			=profile.displayName;
						newUser.google.id		= profile.id;
						newUser.google.token	= token;
						newUser.google.name		= profile.displayName;
						newUser.google.email	= profile.emails[0].value;

						newUser.save(function(err){
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			} else {
				var user			= req.user;
				if (!user.name)
					user.name		= profile.displayName;
				
				user.google.id		= profile.id;
				user.google.token	= token;
				user.google.name	= profile.displayName;
				user.google.email	= profile.emails[0].value;
				
				user.save(function(err){
					if (err)
						throw err;
					return done(null, user);
				});
			}
		}
	));
	
	// Instagram ==================================================================
	passport.use(new InstagramStrategy(
		{
			clientID		: configAuth.instagramAuth.clientID,
			clientSecret	: configAuth.instagramAuth.clientSecret,
			callbackURL		: configAuth.instagramAuth.callbackURL,
			passReqToCallback 	: true
		},
		function(req, token, refreshToken, profile, done){
			if (!req.user) {
				User.findOne({ 'instagram.id' : profile.id }, function(err, user){
					if (err)
						return done(err);
					if (user) {
						return done(null, user);
					} else {
						var newUser 					= new User();
						newUser.name					= profile.displayName;
						newUser.instagram.id			= profile.id;
						newUser.instagram.token			= token;
						newUser.instagram.name			= profile.displayName;

						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			} else {
				var user				= req.user;
				
				if (!user.name)
					user.name				= profile.displayName;
				
				user.instagram.id			= profile.id;
				user.instagram.token		= token;
				user.instagram.name			= profile.displayName;
				
				user.save(function(err) {
					if (err)
						throw err;
					return done(null, user);
				});
			}
		}
	));
		
};				 
		


