var models = {
    User: Backbone.Model.extend({}),
    Workspace: Backbone.Model.extend({})
};
var collections = {
    UserSet: Backbone.Collection.extend({})
};

beforeEach(function() {
    BackboneFixtures.jasmineSetup(models, collections, Backbone.Model, Backbone.Collection);
});