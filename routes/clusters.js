var http = require("http"),
    cheerio = require("cheerio"),
    urlnpm = require("url"),
    request = require("request"),
    Cluster = require('../models/clusters').Cluster,
    ClusterTerm = require('../models/clusters').ClusterTerm;

exports.index = function (req, res) {
    query = {};

    //InsertData();



    Cluster.find(query, function (err, docs) {
        if (!err) {
            var newDocs = [];
            Object.keys(docs).forEach(function (key) {
                var val = docs[key];
                var newDoc = ArticleDto(val);
                newDocs.push(newDoc);
            });

            res.json(200, {
                clusters: newDocs
            });

            //res.json(200, {
            //    clusters: docs
            //});
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
            _id: dmArticle._id,
            clusterId: dmArticle.clusterId,
            terms: GetTerms(dmArticle.terms)
        };
    } else {
        return {};
    }
}

function GetTerms(terms) {
    var result = [];
    for (var i = 0; i < terms.length; i++) {
        var newobj = {
            //id: terms[i]._id,
            //_id: terms[i]._id,
            termName: terms[i].termName,
            termValue: terms[i].termValue
        }
        result.push(newobj);
    }
    return result;
}

function InsertData() {
    var cluster1 = new Cluster({
        clusterId: 1
    });

    cluster1.terms.push({
        termName: "abc",
        termValue: 1234    
    });

    cluster1.terms.push({
        termName: "def",
        termValue: 12345    
    });

    cluster1.save(function(err, user) {
        if(!err) {

        }
    });


    var cluster2 = new Cluster({
        clusterId: 1
    });

    cluster2.terms.push({
        termName: "Saturday",
        termValue: 1234    
    });

    cluster2.terms.push({
        termName: "Night",
        termValue: 12345    
    });

    cluster2.terms.push({
        termName: "Football",
        termValue: 12345    
    });

    cluster2.save(function(err, user) {
        if(!err) {

        }
    });
}