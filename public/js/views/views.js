var ArticlesIndexView = Ember.View.create({
    templateName: 'articles/index',
    testData: 'my test data',
    init: function() {
    },
    didInsertElement: function() {
        debugger;
        this.$("nav li").removeClass("active");
    }
});

App.ArticleEditView = Ember.View.extend({
    tagName: 'form',
    lines: 10,

    didInsertElement: function() {
        debugger;
        //this.$('#myContent').html(this.get('controller').get('model').get('content'));
    },


    submit: function(event) {
        event.preventDefault();
        var $this = this;
        var article = this.get('controller').get('model');

        var onSuccess = function(article) {
            debugger;
            $this.get('controller').transitionToRoute('article', article);
        };

        var onFail = function() {
            // deal with the failure here
            debugger;
        };

        article.save().then(onSuccess, onFail);
    }
});

var ArticlesSearchView = Ember.View.create({
    didInsertElement: function() {
        debugger;
    }
});