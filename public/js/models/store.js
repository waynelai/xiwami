"use strict";

//App.ApplicationAdapter = DS.Ada.FixtureAdapter;

/*
App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'todos-emberjs'
});
*/

//App.ApplicationAdapter = DS.RESTAdapter.extend({
//	host: 'http://localhost:3000'
//});

App.Article = DS.Model.extend({
	title: DS.attr(),
	url: DS.attr(),
	isFavorite: DS.attr(),
    textContent: DS.attr(),
	htmlContent: DS.attr(),
	creationDate: DS.attr(),
	snippet: function() {
	    return this.get('textContent').substring(0, 50);
	}.property('textContent')
});

App.ReturnObj = DS.Model.extend({
    message: DS.attr()
});

//App.Article.FIXTURES = [{
//    id: 1,
//    title: 'Missionary Or Mercenary',
//    url: 'url1',
//    isFavorite: false,
//    content: 'Jeff Bezos is one of the most visionary, focused, and tenacious innovators of our era, and like Steve Jobs he transforms and invents industries.  The Everthing Store is a revelatory read for everyone - those selling and those sold to - who wants to understand the dynamics of the new digital economy.',
//    creationDate: 'Mon, 26 Aug 2013 20:23:43 GMT'
//}, {
//    id: 2,
//    title: 'The Everything Store',
//    url: 'http://wwww.adarp.com/article1',
//    isFavorite: true,
//	content: 'This is a story about Tim.  He said that when you are eighty years old, and in a quiet moment of reflection narrating for only yourself themost personal version of your life story, the telling that will be most compact and meaningful will be the series of choices you have made.  In the end, we are our choices.',
//	creationDate: 'Fri, 07 Aug 2013 10:10:10 GMT'	
//}, {
//    id: 3,
//    title: 'Intellectual Stagnation',
//    url: 'http://wwww.adarp.com/article1',
//    isFavorite: false,
//    content: 'massively underestimate the compounding returns of intelligence',
//    creationDate: 'Fri, 07 Aug 2013 10:10:10 GMT'
//}];
