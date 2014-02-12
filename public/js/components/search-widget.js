App.SearchWidgetComponent = Ember.Component.extend({
    tagName: 'span',
    classNames: ['searchbox'],
    query: "",
    actions: {
        search: function() {
            this.sendAction('action', this.get('query'));
        }
    }
});