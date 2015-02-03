angular.module('storyService', [])


.factory('Story', function($http) {

	// get all approach
	var storyFactory = {};

	storyFactory.all = function() {
		return $http.get('/api/');
	}


	storyFactory.create = function(storyData) {
		return $http.post('/api/', storyData);
	}

	storyFactory.getSingleStory = function(user_name, story_id) {
		return $http.get('/api/' + user_name + story_id);
	}

	return storyFactory;

});