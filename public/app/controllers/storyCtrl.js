// start our angular module and inject our dependecies
angular.module('storyCtrl', ['storyService'])


.controller('StoryController', function(Story, $routeParams, socketio) {

    var vm = this;
    vm.stories = [];

    Story.all()
    .success(function(data) {

        vm.stories = data;
    });


    Story.getSingleStory($routeParams.story_id)
    .success(function(data) {
        vm.storyData = data;
    });

    vm.createStory = function() {
        vm.message = '';

        Story.create(vm.storyData) 
        .success(function(data) {
            // clear the form
            vm.storyData = {}
            vm.message = data.message;
        });
    };

    socketio.on('story', function (data) {
        vm.stories.push(data);
    });
})


.controller('AllStoryController', function(socketio, stories) {

	var vm = this;


    vm.totalDisplayed = 10;

    vm.loadMore = function() {
        vm.totalDisplayed += 10;
    }

	vm.stories = stories.data;

	 socketio.on('story', function (data) {
        vm.stories.push(data);
    });

})

