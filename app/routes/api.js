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


var createStory = function(req, res) {
	
		var story = new Story({
			user: req.decoded.id,
			content: req.body.content
		});

		story.save(function(err, sto) {

			if(err) {
				res.send(err);
				return;
			}

			res.json(sto);
			
		});
	};

module.exports = function(app, express) {

	// creating our first router
	var apiRouter = express.Router();

	// signup a user
	

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

		.post(createStory)


		.get(function(req, res) {

			Story.find({ user: req.decoded.id }, function(err, story) {
				if(err) res.send(err);

				res.json(story);
			});


		});



	apiRouter.route('/me')

		.get(function(req, res) {
			res.json(req.decoded);

		})

		.post(createStory);




	apiRouter.route('/:user_id')


		.get(function(req, res) {

			User.findById(req.params.user_id, function(err, user) {
				//if(err) res.send(err);

				res.json(user);

			});


		})

		.post(createStory)

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


		apiRouter.get('/:user_name/:story_id', function(req, res) {

			User.findOne({ name: req.params.user_name }, function(err, user, next) {

				if(err) return next(err);

				Story.findById(req.params.story_id, function(err, story) {

					if(err) {
						res.send(err);
						return;
					}

					res.json({
						name: user.name,
						story_id: story._id,
						content: story.content

					});

					
				});
			});
		});


	return apiRouter;

}