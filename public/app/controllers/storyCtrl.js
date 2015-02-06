// start our angular module and inject our dependecies
angular.module('storyCtrl', ['storyService'])


.controller('StoryController', function(Story, $routeParams, $scope) {

	var vm = this;

	Story.all()
		.success(function(data) {
			$scope.stories = data;
		});


	Story.getSingleStory($routeParams.user_name, $routeParams.story_id)
		.success(function(data) {
			$scope.storyData = data;
		});

	vm.createStory = function() {
		
		
		vm.message = '';

		Story.create(vm.storyData) 
			.success(function(data) {
				
				
				// clear the form
				vm.storyData = {}
				vm.message = data.message;

				$scope.stories.push(data);
			});
	};

});