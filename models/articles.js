var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var articleSchema = new Schema({
	title: { type: String, trim: true },
	url: { type: String },
	isFavorite: Boolean,
	textContent: { type: String },
	htmlContent: { type: String },
	creationDate: { type: Date, default: Date.now }
});

var articleModel = mongoose.model('article', articleSchema);

module.exports = {
	Article: articleModel
};
