function getView(name) {
        var template = '';
        $.ajax(
                {
                    url: '/Templates/' + name + '.htm',
                    async: false,
                    success: function (text) {
                        template = text;
                    }
                });
        return Ember.Handlebars.compile(template);
    };

App = Ember.Application.create({ LOG_TRANSITIONS: true});
//App = Ember.Application.createWithMixins(Bootstrap.Register);

App.Router.map(function() {
  this.resource('articles', function(){
      this.resource('article', { path: '/article/:id' }, function () {
      this.route('edit');
    });
    this.route('add');
    this.route('favorites');
    this.route('recent');
  });
  
  this.resource('explore', function() {
  	
  });
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return ['red', 'yellow', 'blue'];
    },
    
    setupController: function (controller) {
        controller.set('pageHeader', "My Apps");
    }
});

App.ArticlesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('article');
	}
});

App.ArticlesIndexRoute = Ember.Route.extend({
	model: function() {
	    return this.store.find('article'); 
	},
	setupController: function(controller, model) {
    	controller.set('model', model);
	}
});

App.ArticlesAddRoute = Ember.Route.extend({
    model: function () {
        return Em.Object.create({});
    }
});

App.ArticlesFavoritesRoute = Ember.Route.extend({
	model: function() {
	    //debugger;
	    return this.store.find('article', { isFavorite: true });
	    //return this.store.filter('article', { favorited: true }, function (article) {
	    //    return article.get('isFavorite');
	    //});
	}
});

App.ArticlesRecentRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('article');
	}
});

App.ArticleRoute = Ember.Route.extend({   
	model: function(params) {
		debugger;
		return this.store.find('article', params.article_id);
	},
});

App.ArticleIndexRoute = Ember.Route.extend({
	model: function(params) {
		debugger;
		return this.store.find('article', params.article_id);
	}
});

App.ArticleEditRoute = Ember.Route.extend({
	model: function() {
		debugger;
		return this.store.find('article');
	}
});
