var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;


var StorySchema = new Schema({

	user: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	createdAt: { type: Date, default: Date.now }

});


module.exports = mongoose.model('Story', StorySchema);