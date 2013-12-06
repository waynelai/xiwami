var http = require("http");
//var cheerio = require("cheerio");
var Article = require('../models/articles').Article;

exports.list = function(req, res) {
	//res.json(200, { message: "My first route"});
    query = {};
    
    if (req.query.isFavorite == "true") {
        query.isFavorite = true;
    }

	Article.find(query, function(err, docs) {
	    if (!err) {

	        var newDocs = [];

	        Object.keys(docs).forEach(function (key) {
	            var val = docs[key];
	            //var newDoc = {
	            //    id: val._id,
	            //    url: val.url,
	            //    content: val.content,
	            //    creationDate: val.creationDate,
	            //    title: val.title
	            //};

	            var newDoc = ArticleDto(val);
	            newDocs.push(newDoc);
	        });

			res.json(200, {
				articles : newDocs
			});
		} else {
			res.json(500, {
				message : err
			});
		}
	});
};

function ArticleDto(obj) {
    return {
        id: obj._id,
        url: obj.url,
        content: obj.content,
        creationDate: obj.creationDate,
        title: obj.title
    };
}

exports.view = function(req, res) {
	//res.json(200, { message: "My first route"});

	Article.findById(req.params.id, function(err, docs) {
	    if (!err) {

			res.json(200, {
				article : ArticleDto(docs[0])
			});
		} else {
			res.json(500, {
				message : err
			});
		}
	});
};


// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

exports.create = function(req, res) {

	var article = req.body.article;
	var url = article.url;

	//debugger;
	//Workout.findOne({ name: workout_name }, function(err, doc) {  // This line is case sensitive.
	Article.findOne({
		url : {
			$regex : new RegExp(url, "i")
		}
	}, function(err, doc) {// Using RegEx - search is case insensitive
		if (!err && !doc) {
			
			download(url, function(data) {
				if (data) {			
    				var $ = cheerio.load(data);

      				var title = $('title').text();
			
					var newArticle = new Article();
		
					newArticle.title = title;;
					newArticle.url = url;
					//newArticle.content = data;
					newArticle.content = "";
					newArticle.isFavorite = false;
					newArticle.creationDate = new Date();
                    newArticle.rawContent = "";
		
					newArticle.save(function(err, art) {
		
					    if (!err) {
					        req.session.message = ["Article Created"];
							//res.json(201, {
							//	message : "Article created with ID: " + art._id.toString()
							//});
						} else {
							res.json(500, {
								message : "Could not create article. Error: " + err
							});
						}
		
					});					
				}
				else {
					res.json(403, {
						message : "Cannot access the article from the web."
					});					
				}
			});
			


		} else if (!err) {

			// User is trying to create a workout with a name that already exists.
			res.json(403, {
				message : "Article with that url already exists, please update instead of create or create a new article with a different url."
			});

		} else {
			res.json(500, {
				message : err
			});
		}
	});

};
