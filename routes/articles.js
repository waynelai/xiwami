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
            isFavorite: dmArticle.isFavorite,
            publishTime: dmArticle.publishTime,
            hostName: dmArticle.hostName
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

function CreateArticleDomainModel(title, url, text, html, publishTime, hostName) {
    var newArticle = new Article();

    newArticle.title = title;;
    newArticle.url = url;
    newArticle.textContent = text;
    newArticle.htmlContent = html;
    newArticle.isFavorite = false;
    newArticle.creationDate = new Date();
    newArticle.publishTime = new Date(publishTime);
    newArticle.hostName = hostName;

    return newArticle;
}

exports.create = function (req, res) {
    var article = req.body.article;
    var url = article.url;

    Article.findOne({
        url: {
            $regex: new RegExp(url, "i")
        }
    }, function (err, doc) {// Using RegEx - search is case insensitive
        if (!err && !doc) {
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body),
                        title = $('title').text(),
                        host = urlnpm.parse(url).host,
                        text = '',
                        html = '',
                        publishTime,
                        $p,
                        hostName = '';

                    if (host.search('cnn.com') > -1) {
                        hostName = 'cnn.com';
                        var $parray = $('.cnn_strycntntlft p');

                        $parray.each(function (index, value) {
                            $p = $(this);
                            html += $p.html();
                            text += $p.text();
                        });
                    } else if (host.search('espn.go.com') > -1) {
                        hostName = 'espn.go.com';
                        var $parray = $('.article p');

                        $parray.each(function (index, value) {
                            $p = $(this);
                            html += $p.html();
                            text += $p.text();
                        });
                    } else if (host.search('mrsec.com') > -1) {
                        hostName = 'mrsec.com';
                        var $parray = $('div.text p');

                        title = $('div.cunlock_main_content h1 a.link1').text();
                        publishTime = $("meta[property='article:published_time']").attr("content");
                        $parray.each(function (index, value) {
                            $p = $(this);
                            html += "<p>" + $p.html() + "</p>";
                            text += $p.text();
                        });
                    } else if (host.search('frankthetank.me') > -1) {
                        hostName = 'frankthetank.me';
                        var $parray = $('div.entry p');

                        title = $('.pagetitle').text();
                        publishTime = url.substring(23, 33);
                        $parray.each(function (index, value) {
                            $p = $(this);
                            html += "<p>" + $p.html() + "</p>";
                            text += $p.text();
                        });
                    } else {
                        $('script').remove();
                        $('noscript').remove();
                        text = $('body').text().replace(/\s{2,9999}/g, ' ');
                        html = $('body').text();
                    }

                    var newArticle = CreateArticleDomainModel(title, url, text, html, publishTime, host);

                    newArticle.save(function (err, art) {
                        if (!err) {
                            //req.session.message = ["Article Created"];
                            var obj = ArticleDto(art);
                            //request.write(JSON.stringify(some_json),encoding='utf8');

                            var options = {
                              //uri: 'http://localhost:8983/solr/core1/update/json?commit=true',
                              uri: 'http://192.168.244.133:8983/solr/core1/update/json?commit=true',
                              method: 'POST',
                              json:  [obj]
                            };

                            request(options, function (error, response, body) {
                              if (!error && response.statusCode == 200) {
                                console.log(body.id) // Print the shortened url.
                              }
                            });

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
                } else {
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
