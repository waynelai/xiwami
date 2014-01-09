var http = require("http"),
    cheerio = require("cheerio"),
    urlnpm = require("url"),
    request = require("request"),
    Article = require('../models/articles').Article;

exports.list = function (req, res) {
    query = {};

    if (req.query.isFavorite == "true") {
        query.isFavorite = true;
    }

    Article.find(query, function (err, docs) {
        if (!err) {

            var newDocs = [];

            Object.keys(docs).forEach(function (key) {
                var val = docs[key];
                var newDoc = ArticleDto(val);
                newDocs.push(newDoc);
            });

            res.json(200, {
                articles: newDocs
            });
        } else {
            res.json(500, {
                message: err
            });
        }
    });
};

function ArticleDto(dmArticle) {
    if (dmArticle) {
        return {
            id: dmArticle._id,
            url: dmArticle.url,
            textContent: dmArticle.textContent,
            htmlContent: dmArticle.htmlContent,
            creationDate: dmArticle.creationDate,
            title: dmArticle.title,
            isFavorite: dmArticle.isFavorite
        };
    } else {
        return {};
    }
}

exports.view = function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (!err) {
            res.json(200, {
                article: ArticleDto(article)
            });
        } else {
            res.json(500, {
                message: err
            });
        }
    });
};


    // Utility function that downloads a URL and invokes
    // callback with the data.
function download(url, callback) {
    http.get(url, function (res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            callback(data);
        });
    }).on("error", function () {
        callback(null);
    });
};

function CreateArticleDomainModel(title, url, text, html) {
    var newArticle = new Article();

    newArticle.title = title;;
    newArticle.url = url;
    newArticle.textContent = text;
    newArticle.htmlContent = html;
    newArticle.isFavorite = false;
    newArticle.creationDate = new Date();

    return newArticle;
}

exports.create = function (req, res) {
    var article = req.body.article;
    var url = article.url;

    //debugger;
    //Workout.findOne({ name: workout_name }, function(err, doc) {  // This line is case sensitive.
    Article.findOne({
        url: {
            $regex: new RegExp(url, "i")
        }
    }, function (err, doc) {// Using RegEx - search is case insensitive
        if (!err && !doc) {
            download(url, function (data) {
                if (data) {
                    var $ = cheerio.load(data),
                        title = $('title').text(),
                        host = urlnpm.parse(url).host,
                        text = '',
                        html = '';

                    if (host.search('cnn.com') > 0) {
                        // CNN.com
                        var $parray = $('.cnn_strycntntlft p');

                        $parray.each(function (index, value) {
                            $p = $(this);
                            html += $p.html();
                            text += $p.text();
                        });
                    } else {
                        $('script').remove();
                        $('noscript').remove();
                        text = $('body').text().replace(/\s{2,9999}/g, ' ');
                        html = $('body').text();
                    }

                    var newArticle = CreateArticleDomainModel(title, url, text, html);

                    newArticle.save(function (err, art) {
                        if (!err) {
                            //req.session.message = ["Article Created"];
                            var obj = ArticleDto(art);
                            res.json(201, {
                                //message: "Article created with ID: " + art._id.toString()
                                article: obj
                            });
                        } else {
                            res.json(500, {
                                message: "Could not create article. Error: " + err
                            });
                        }
                    });
                }
                else {
                    res.json(403, {
                        message: "Cannot access the article from the web."
                    });
                }
            });

        } else if (!err) {
            // User is trying to create a workout with a name that already exists.
            res.json(403, {
                message: "Article with that url already exists, please update instead of create or create a new article with a different url."
            });

        } else {
            res.json(500, {
                message: err
            });
        }
    });
};

exports.update = function (req, res) {
    var article = req.body.article;

    Article.update({_id: req.params.id}, { isFavorite: article.isFavorite, title: article.title }, {}, function (err, numberAffected, raw) {
        if (err) {
            res.json(500, {
                message: "Could not create article. Error: " + err
            });
            return;
        }

        res.json(200, {
            ReturnObj: {message: "Article updated successfully: " + raw}
        });

    });
};
