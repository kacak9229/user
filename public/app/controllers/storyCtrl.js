// start our angular module and inject our dependecies
angular.module('storyCtrl', ['storyService'])


.controller('StoryController', function(Story, $routeParams) {

	var vm = this;

	Story.all()
		.success(function(data) {
			vm.stories = data;
		});


	Story.getSingleStory($routeParams.user_name, $routeParams.story_id)
		.then(function(data) {
			vm.storyData = data;
		});

	vm.createStory = function() {
		
		
		vm.message = '';

		Story.create(vm.storyData) 
			.success(function(data) {
				
				
				// clear the form
				vm.storyData = {}
				vm.message = data.message;

				vm.stories.push(data);
			});
	};

});