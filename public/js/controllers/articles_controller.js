App.ApplicationController = Ember.ObjectController.extend({
    content: [
        Ember.Object.create({title: 'Home', linkTo: 'index'}),
        Ember.Object.create({title: 'Manage', linkTo: 'articles'}),
        Ember.Object.create({title: 'Recent', linkTo: 'recent'}),
        Ember.Object.create({title: 'Explore', linkTo: 'explore'}),
        Ember.Object.create({title: 'Favorites', linkTo: 'articles.favorites'}),
        Ember.Object.create({title: 'Add', linkTo: 'articles.add'})
    ],

    actions: {
        search: function(query) {
            this.transitionToRoute('articles.search', query);
        }
    },

    contentChanged: (function() {
        return console.log("Selection has changed to: " + (this.get('selected').title));
    }).observes('selected')
});

App.IndexController = Ember.ObjectController.extend({
    pageHeader: "This is the index page.",
    pageDescription: "This is going to be a beautiful layout of recent articles from you or your friends",
});

App.ArticlesAddController = Ember.ObjectController.extend({
    pageHeader: "Save a new article.",
    pageDescription: "",

    actions: {
        save: function (params) {
            var $this = this;
            var url = this.get('url');
            // just before saving, we set the creationDate
            this.get('model').set('creationDate', new Date());
            this.get('model').set('url', url);
            this.get('model').set('title', 'new title');
            this.get('model').set('isFavorite', false);
            this.get('model').set('content', 'content2');

            // create a record and save it to the store
            var newArticle = this.store.createRecord('article', this.get('model'));

            var onSuccess = function(article) {
                debugger;
                $this.transitionToRoute('article', article);
            };

            var onFail = function(article) {
                // deal with the failure here
                debugger;
            };

            newArticle.save().then(onSuccess, onFail);
    	}
	}
});

App.ArticleEditController = Ember.ObjectController.extend({
    actions: {
        save: function (params) {
            debugger;
            // just before saving, we set the creationDate
            var article = this.get('model');

            var onSuccess = function(article) {
                this.transitionToRoute('article/index', article);
            };

            var onFail = function(post) {
                // deal with the failure here
            };

            article.save().then(onSuccess, onFail);

            // redirects to the user itself
            //this.transitionToRoute('article', newArticle);
    	}
	}
});

//App.ArticlesIndexController = Ember.ArrayController.extend({
//    pageHeader: "List all the articles",
//    pageDescription: "",

//	init: function() {
		
//	}
//});