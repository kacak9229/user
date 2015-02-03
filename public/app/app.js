angular.module('userApp', ['ngAnimate', 'appRoutes', 'authService', 'mainCtrl', 'userCtrl', 'userService', 'storyCtrl', 'storyService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
    
});




// ['$window', function ($window) {
//         return {
//             request: function (config) {
//                 config.headers.TokenType = 'jwt';
//                 config.headers['x-access-token'] = $window.localStorage.getItem('token');
//                 return config;
//             }
//         };
//     }]);

