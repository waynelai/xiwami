var ArticlesIndexView = Ember.View.create({
    templateName: 'articles/index',
    testData: 'my test data',
    init: function() {
        debugger;
    },
    didInsertElement: function() {
        debugger;
        this.$("nav li").removeClass("active");
    }
});