// app/routes.js

var Nerd = require('./models/nerds.js');

module.exports = function(app, passport) {
	
// ====================================================================================================
//  Authorization =====================================================================================
// ====================================================================================================
	
	// Login Form 	==============================================================================
	app.get('/login', function(req, res){
		res.render('login', { message: req.flash('loginMessage'), title: 'MatchDwell | Login'});
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	
	// Signup Form	==============================================================================
	app.get('/signup', function(req, res){
		res.render('signup', { message: req.flash('signupMessage'), title: 'MatchDwell | Sign Up'});
	});
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash	: true
	}));
	// Local account connection
	app.get('/connect/local', function(req, res) {
		res.render('connect-local', {message: req.flash('loginMessage')});
	});
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash: true
	}));
	// Local account removal
	app.get('/unlink/local', function(req, res){
		var user			= req.user;
		user.local.email	= undefined;
		user.local.password	= undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});
		
	
	// Facebook Auth =============================================================================
	app.get('/auth/facebook' , passport.authenticate('facebook', {scope : 'email'}));
	app.get('/auth/facebook/callback' , passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));	
	app.get('/connect/facebook', passport.authorize('facebook', {scope : 'email'}));
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
			successRedirect :'/profile',
			failureRedirect : '/'
		}));
	// unlink
	app.get('/unlink/facebook', function(req, res) {
		var user			= req.user;
		user.facebook.token	= undefined;
		user.facebook.id	= undefined;
		user.save(function(err){
			res.redirect('/profile');
		});
	});
	
	
	// Google Auth ===============================================================================
	app.get('/auth/google' , passport.authenticate('google', {scope : ['profile', 'email']}));
	app.get('/auth/google/callback' , passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));
	app.get('/connect/google', passport.authorize('google', {scope : ['profile', 'email']}));
	app.get('/connect/google/callback' , passport.authorize('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));
	// unlink
	app.get('/unlink/google', function(req, res) {
		var user			= req.user;
		user.google.token	= undefined;
		user.google.token	= undefined;
		user.save(function(err){
			res.redirect('/profile');
		});
	});
	
	
	// Instagram Auth ============================================================================
	app.get('/auth/instagram' , passport.authenticate('instagram'));	
	app.get('/auth/instagram/callback' , passport.authenticate('instagram', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));	
	app.get('/connect/instagram', passport.authorize('instagram'));
	app.get('/connect/instagram/callback' , passport.authorize('instagram', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));
	// unlink
	app.get('/unlink/instagram', function(req, res) {
		var user				= req.user;
		user.instagram.token	= undefined;
		user.instagram.id		- undefined;
		user.save(function(err){
			res.redirect('/profile');
		});
	});
	
	
	// Profile Page	==============================================================================
	app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
			title: 'MatchDwell | Profile',
            user : req.user // get the user out of session and pass to template
        });
    });
	
	
	// Logout 		==============================================================================
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
		
	
	// isLoggedIn Function	======================================================================
	function isLoggedIn(req, res, next){
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}

	// nerd api route
	app.get('/api/nerds', function(req, res) {
		Nerd.find(function(err, nerds) {
			if (err)
				res.send(err);
			res.json(nerds);
		});
	});
	
		// Home Page 	==============================================================================
	app.get('*', function(req, res){
		res.render('index', { title: 'MatchDwell | Home' });
	});
	
};



	
