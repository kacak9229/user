angular.module('storyService', [])


.factory('Story', function($http, $window) {

	// get all approach
	var storyFactory = {};
	
	var generateReq = function(method, url, data) {
            var req = {
              method: method,
              url: url,
              headers: {
                'x-access-token': $window.localStorage.getItem('token')
              },
              cache: false
          	}

            if(method === 'POST') {
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

	storyFactory.getSingleStory = function(story_id) {
		return $http(generateReq('GET', '/api/' + story_id));
	};

	storyFactory.allStories = function() {
		return $http(generateReq('GET', '/api/all_stories'));
	};

	return storyFactory;

})


.factory('socketio', ['$rootScope', function ($rootScope) {
        
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);
