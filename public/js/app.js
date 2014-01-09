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

//PM = Ember.Application.create({
//    loadView: function(view){
//        $.ajax({
//            url: viewPath,
//            success: function (template) {
//                if (!Ember.TEMPLATES[templateName]) {
//                    Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(template);
//                };
//                PM[view + 'View'].appendTo('body');
//            }
//        });
//    }
//});

//App = Ember.Application.create({ LOG_TRANSITIONS: true});
App = Ember.Application.createWithMixins(Bootstrap.Register);

App.Router.map(function () {
	this.resource('articles', function () {
		this.route('add');
		this.route('favorites');
	});

	this.resource('article', { path: '/article/:id' }, function () {
		this.route('edit');
	});

	this.resource('explore', function () {

	});

	this.resource('recent', function () {

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

//App.ArticlesRoute = Ember.Route.extend({
//	model: function() {
//        debugger;
//		return this.store.find('article');
//	}
//});

App.ArticlesIndexRoute = Ember.Route.extend({
	model: function() {
		//debugger;
		return this.store.find('article'); 
	},
	setupController: function(controller, model) {
		//debugger;
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
		return this.store.find('article', params.id);
	},
});

App.ArticleIndexRoute = Ember.Route.extend({
	beforeModel: function(transition, queryparams) {

	},
	model: function(params, transition, queryparams) {
		//debugger;
		return this.store.find('article', transition.providedModels.article.id);
	},
	afterModel: function(article, transition, queryparam) {

	}
});

App.ArticleEditRoute = Ember.Route.extend({
	model: function(params, transition, queryparams) {
		return this.store.find('article', transition.params.id);
	}
});

App.ExplorerIndexRoute = Ember.Route.extend({
	beforeModel: function(transition, queryparams) {

	},
	model: function(params, transition, queryparams) {
		return this.store.find('article');
	},
	afterModel: function(article, transition, queryparam) {

	}
});
