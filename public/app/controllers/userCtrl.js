// start our angular module and inject userService
angular.module('userCtrl', ['userService'])

// user controller for the main page
// inject the User factory
.controller('UserController', function(User) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the users at page load
	User.all()
		.success(function(data) {
			// when all the users come back, remove the processing variable
			vm.processing = false;

			// bind the users that come back to vm.users
			vm.users = data;

		})

	vm.deleteUser = function(id) {
		vm.processing = true;

		// accpets the user id as a parameter
		User.delete(id)
			.success(function(data) {

				// get all users to update the table

				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};
})

.controller('UserCreateController', function(User, $location, $window) {

	var vm = this;

	
	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;

		// clear the message
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.then(function(response) {
				vm.processing = false;

				// clear the form
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
		});
			
	};

})

// contorller applied to user edit page
.controller('UserEditController', function($routeParams, User) {

	var vm = this;

	vm.type = 'edit';

	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	// function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				vm.processing = false;


				// clear the form
				vm.userData = {};

				// bind the message from our API tp vm.message
				vm.message = data.message


			});
	};

})

.controller('SingleUserController', function($routeParams, User) {
	
	var vm = this;

	User.get($routeParams.user_id)
		.success(function(data) {
			vm.singleUser = data;
		})
})


.controller('FollowAndUnfollowController', function($routeParams, User) {


	var vm = this;

	vm.type1 = "follow";
	vm.type2 = "unfollow";
	
	vm.setFollow = function() {
		if(vm.type1) {

			User.follow($routeParams.id)
			.success(function(data) {
				vm.user = data.data;

			})


		} else if(vm.type2) {

			User.unfollow($routeParams.id)
			.success(function(data) {
				vm.user = data.data;
			});
		}
	}

	vm.follow = function(id) {

		User.follow($routeParams.id)
			.success(function(data) {
				//
			});
	}



});
