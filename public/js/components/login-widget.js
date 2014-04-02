App.LoginWidgetComponent = Ember.Component.extend({
    tagName: 'span',
    classNames: ['loginbox'],
    query: "",
    actions: {
        search: function() {
            this.sendAction('action', this.get('query'));
        }
    }
});