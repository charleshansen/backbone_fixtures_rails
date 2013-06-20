var BackboneFixtures = BackboneFixtures || {};

BackboneFixtures.jasmineSetup = _.once(function(models, collections, baseModel, baseCollection) {
    var allFixturesLoaded = false;

    function loadAllFixtures() {
        var fixtureContainer = $("<div id='fixtures'/>");
        $("body").append(fixtureContainer);
        return $.ajax({
            async: true,
            cache: false,
            dataType: 'html',
            url: '/__fixtures',
            success: function(data) {
                fixtureContainer.append(data);
                allFixturesLoaded = true;
            },
            error: function(data) {
                window.alert("Sorry but I couldn't load the fixtures! Things will go REALLY poorly from here...");
                allFixturesLoaded = true;
            }
        });
    }

    runs(loadAllFixtures);
    waitsFor(function() {
        return allFixturesLoaded;
    }, "all templates and fixtures to be loaded", 5000);

    BackboneFixtures.initialize(models, collections, baseModel, baseCollection);
});
