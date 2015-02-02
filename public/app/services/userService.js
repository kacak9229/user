angular.module('userService', [])


.factory('User', function($http, $window) {


	var userFactory = {};

	userFactory.get = function(id) {
		return $http.get('/api/' + id);
	}

	userFactory.all = function() {
		return $http.get('/api/users');
	}


	userFactory.create = function(userData) {
    var req = {
        method: 'POST',
        url: '/api/signup',
        data: userData
    }
    return $http(req);
}


	userFactory.update = function(id, userData) {
		return $http.put('/api/' + id, userData);
	}

	return userFactory;
});

