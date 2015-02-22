angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})


		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html',
			controller: 'UserCreateController',
			controllerAs: 'user'
		})	

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'MainController',
    		controllerAs: 'login'
		})

		// show all users
		.when('/users', {
			templateUrl : 'app/views/pages/users/all.html',
			controller : 'UserController',
			controllerAs : 'user'
		})


		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/singleUser.html',
			controller: 'UserEditController',
			controllerAs: 'user'
		})

		.when('/allStories', {
			templateUrl : 'app/views/pages/allStories.html',
			controller: 'AllStoryController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story) {
					return Story.allStories();
				}
			}

		})

		.when('/stories/:story_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'StoryController',
			controllerAs: 'story',
		})

		.when('/single/:user_id', {
			templateUrl: 'app/views/pages/users/single2.html',
			controller: 'SingleUserController',
			controllerAs: 'user'
		})

		.when('/logout', {
			templateUrl: 'app/views/pages/logout.html',
		});
		
		// show all users
	$locationProvider.html5Mode(true);

});