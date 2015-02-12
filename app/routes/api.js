var User 		= require('../models/user');
var Story 		= require('../models/story');
var jwt 		= require('jsonwebtoken');
var config		= require('../../config');


var superSecret = config.secret;

var createToken = function(user) {

	var token = jwt.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, superSecret, {
		expiresInMinute: 1440
	});

	return token;

}



module.exports = function(app, express, io) {

	// creating our first router
	var apiRouter = express.Router();

	// signup a user
	


	apiRouter.get('/all_stories', function(req, res) {

			Story.find({} , function(err, stories) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(stories);
			});
		});
	

	apiRouter.post('/signup', function(req, res) {

			var user = new User({
				name: req.body.name,
				username: req.body.username,
				password: req.body.password
			});

			var token = createToken(user);
			user.save(function(err) {
				if(err) { 
					res.send(err);
				 	return;
				}

				res.json({
					success: true, 
					message: 'User has been created!',
					token: token
				});
			});
	});

	apiRouter.get('/users', function(req, res) {

		User.find({}, function(err, users) {

			if(err) res.send(err);

			res.json(users);

		});

	});


	// user login

	apiRouter.post('/login', function(req, res) {

		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if(err) throw err;

			if(!user) {
				res.json({ message: "Wrong User" });
			} else if(user) {

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.json({ message: "Invalid Password" });

				} else {

					var token = createToken(user);

					// return all the sucess
					res.json({
						success: true,
						message: "Successfully login and token created!",
						token: token
					});
				};

			}

		});

	});


	apiRouter.use(function(req, res, next) {

		// do logging
		console.log("Somebody just came to our app!");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// check if token exist
		if(token) {

			jwt.verify(token, superSecret, function(err, decoded) {
				if(err) {
					res.status(403).send({ success: false, message: 'Failed to authenticate user' });
				} else {

					// if everything is good save request for use in other routes
					req.decoded = decoded;

					next(); 
				}
			});

		} else {
			res.status(403).send({ success: false, message: 'No token provided' });
		}
	});


	apiRouter.route('/')

		.post(function(req, res) {
	
		var story = new Story({
			user: req.decoded.id,
			content: req.body.content
		});

		story.save(function(err) {

			if(err) {
				res.send(err);
				return;
			}

			io.emit('story', {
				user: req.decoded.id,
				createdAt: new Date(),
				content: req.body.content
			});
			res.json({ message: 'Story has been created!'});
			
		})

	})
	


		.get(function(req, res) {

			Story.find({ user: req.decoded.id }, function(err, story) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(story);
			});


		});

	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});


	apiRouter.get('/:story_id', function(req, res) {

			Story.findById(req.params.story_id, function(err, story) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(story);
			});
		});

	

	apiRouter.route('/:user_id')


		.get(function(req, res) {

			User.findById(req.params.user_id, function(err, user) {
				if(err) {
					res.send(err);
					return;
				}

				res.json(user);

			});


		})

		

		.put(function(req, res) {

			User.findById(req.params.user_id, function(err, user) {

				if(err) res.send(err);

				if(req.body.name) {
					user.name = req.body.name;
				}

				if(req.body.username) {
					user.username = req.body.username;

				}

				if(req.body.password) {
					user.password = req.body.password;
				}

				user.save(function(err) {
					if(err) res.send(err);

					res.json({ message: "User updated" });

				});


			});

		});


	apiRouter.post('/follow/:user_id', function(req, res) {

		// find a current user that has logged in
			User.update(
				{   
					_id: req.decoded.id, 
					following: { $ne: req.params.user_id } 
				}, 

				{ 
					$push: { following: req.params.user_id},
					$inc: { followingCount: 1}

				},
				function(err) {
					if (err) {
						res.send(err);
						return;
					}
					
					User.update(
						{
							_id: req.params.user_id,
							followers: { $ne: req.decoded.id }
						},

						{	
							$push: { followers: req.decoded.id },
							$inc: { followersCount: 1}

						}

					), function(err) {
						if(err) return res.send(err);

						res.json({ message: "Successfully Followed!" });
					}

			});
	});

	apiRouter.post('/unfollow/:user_id', function(req, res) {

		User.update({
			_id: req.decoded.id,
			following: req.params.user_id
		}, {
			$pull: { following: req.params.user_id },
			$inc: { followingCount: -1}
		}, function(err, user) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ message: "Successfully Un- followed!" });
		});
	});

		
	return apiRouter;

}


