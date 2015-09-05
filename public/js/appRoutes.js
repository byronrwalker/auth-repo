// public/js/appRoutes.js
	angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/index.jade',
				controller: 'MainController'
			})
			.when('/nerds', {
				templateUrl: 'views/nerd.jade',
				controller: 'NerdController'
			});
		
		$locationProvider.html5Mode(true);
		
	}]);