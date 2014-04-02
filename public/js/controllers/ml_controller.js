App.ExploreController = Ember.ObjectController.extend({
    pageHeader: "ML Page",
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