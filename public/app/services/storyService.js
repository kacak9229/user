angular.module('storyService', [])


.factory('Story', function($http) {

	// get all approach
	var storyFactory = {};
	
	var generateReq = function(method, url, data) {
            var req = {
              method: method,
              url: url,
              headers: {
                'x-access-token': $window.localStorage.getItem('token')
              };
            if (method === 'POST') {
            	req.data = data;
            }
            return req;
        };

	storyFactory.all = function() {
		return $http(generateReq('GET', '/api/'));
	};


	storyFactory.create = function(storyData) {
		return $http(generateReq('POST', '/api/', storyData));
	};

	storyFactory.getSingleStory = function(user_name, story_id) {
		return $http(generateReq('GET', '/api/' + user_name + story_id));
	};

	return storyFactory;

});
