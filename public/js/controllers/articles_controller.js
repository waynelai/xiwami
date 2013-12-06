App.IndexController = Ember.ObjectController.extend({

    pageHeader: "This is the index page.",
    pageDescription: "This is going to be a beautiful layout of recent articles from you or your friends"

});

App.ArticlesAddController = Ember.ObjectController.extend({
    pageHeader: "Save a new article.",
    pageDescription: "",

    actions: {
        save: function (params) {
            var url = this.get('url');
            // just before saving, we set the creationDate
            this.get('model').set('creationDate', new Date());
            this.get('model').set('url', url);
            this.get('model').set('title', 'new title');
            this.get('model').set('isFavorite', false);
            this.get('model').set('content', 'content2');

            // create a record and save it to the store
            var newArticle = this.store.createRecord('article', this.get('model'));
            newArticle.save();

            // redirects to the user itself
            //this.transitionToRoute('article', newArticle);
    	}
	}
});

App.ArticlesIndexController = Ember.ArrayController.extend({
    pageHeader: "List all the articles",
    pageDescription: "",

	init: function() {
		
	}
});