// config/auth.js

// config options for login sources

module.exports = {
	'facebookAuth'			: {
		'clientID'			: '120282738319551',
		'clientSecret'		: '1fb5889f109a21b7948671467a7a6724',
		'callbackURL'		: 'http://localhost:3000/auth/facebook/callback'
	},
	'googleAuth'			: {
		'clientID'			: '430207348476-76cnuvmru3ha6rqbolh47kk9ouniac9c.apps.googleusercontent.com',
		'clientSecret'		: 'OQZWd6vGd98Vn4CoWG3Vj7hP',
		'callbackURL'		: 'http://localhost:3000/auth/google/callback'
	},
	'instagramAuth'			: {
		'clientID'			: '62c933949d434710a550adbd9b423768',
		'clientSecret'		: 'f889bf3bdba9407cbb94fdcd8ed44171',
		'callbackURL'		: 'http://localhost:3000/auth/instagram/callback'
	}
}