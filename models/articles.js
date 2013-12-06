var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var articleSchema = new Schema({
	title: { type: String, trim: true },
	url: { type: String },
	isFavorite: Boolean,
	content: { type: String },
    rawContent: { type: String },
	creationDate: { type: Date, default: Date.now }
});

var articleModel = mongoose.model('article', articleSchema);

module.exports = {
	Article: articleModel
};
