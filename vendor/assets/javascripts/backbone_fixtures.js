var BackboneFixtures = {};

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

BackboneFixtures.initialize = function(models, collections, baseModel, baseCollection) {
    function addUniqueDefaults(attributeObjects, keyStrings) {
        if (!_.isArray(attributeObjects)) attributeObjects = [attributeObjects];
        _.each(keyStrings, function(keyString) {
            var keys = keyString.split(".");
            var lastKey = keys.pop();

            _.each(attributeObjects, function(attributeObject) {
                var nested = attributeObject;
                _.each(keys, function(key) {
                    nested[key] || (nested[key] = {});
                    nested = nested[key];
                });
                if (nested[lastKey] === undefined) nested[lastKey] = _.uniqueId() + "";
            });
        });
    }

    function deepClone(original) {
        return JSON.parse(JSON.stringify(original));
    }

    function safeExtend(original, overrides, name) {
        var result = _.isArray(original) ? [] : _.clone(original);

        _.each(overrides, function(value, key) {
            if (original[key] === undefined) {
                if (_.isArray(original)) {
                    result[key] = value;
                    return;
                } else {
                    throw "The fixture '" + name + "' has no key '" + key + "'";
                }
            }

            if (_.isObject(original[key])) {
                result[key] = safeExtend(original[key], overrides[key], name + "." + key);
            } else {
                result[key] = value;
            }
        });

        return result;
    }

    function defineAllFixtures(fixtureModule) {
        function initializeChildDefinitions(definition) {
            _.each(definition.children, function(childDef) {
                _.each(definition, function(value, property) {
                    if (property === "children") { return; }
                    childDef[property] || (childDef[property] = definition[property]);
                });
            });
        }

        function addDerivedAttributes(attrs, overrides, derivationMethods) {
            _.each(derivationMethods, function(method, attrName) {
                if (!overrides[attrName]) {
                    attrs[attrName] = method(attrs);
                }
            });
        }

        function saveParsedJson(name, parentName) {
            var parsedJson = fixtureModule.parsedJson;
            if (parentName) {
                parsedJson = parsedJson[parentName] || (parsedJson[parentName] = {});
            }
            if (!parsedJson[name]) {
                var path = _.compact([fixtureModule.rawJsonPathPrefix, parentName, name]).join("/");
                var $element = $("#fixtures [data-fixture-path='" + path + "']");
                if (!$element.length) throw "No fixture for " + path;
                parsedJson[name] = JSON.parse($element.html());
            }
            return parsedJson[name];
        }

        function defaultOverridesFor(rawData) {
            if (_.isArray(rawData)) {
                return _.map(rawData, function() { return {}; });
            } else {
                return {};
            }
        }

        function getClass(definition, name) {
            if (definition.model) {
                return models[definition.model];
            } else if (definition.collection) {
                return collections[definition.collection];
            } else {
                var isCollection = name.match(/Set/);
                var className = name.replace(/(?:^|\s)\S/g, function(ch){ return ch.toUpperCase(); }); //titleize
                return (isCollection ? collections[className] : models[className]) || baseModel;
            }
        }

        function generateFixture(definition, name, parentName) {
            var module = parentName ? fixtureModule[parentName] : fixtureModule;
            var klass = getClass(definition, parentName || name);
            var jsonMethodName = name + "Json";

            module[name] = function(overrides) {
                var model = new klass();
                var populatedModel = model.parse(saveParsedJson(name, parentName));
                overrides || (overrides = defaultOverridesFor(populatedModel));
                addUniqueDefaults(overrides, definition.unique);

                var attrs = safeExtend(populatedModel, overrides, name);
                addDerivedAttributes(attrs, overrides, definition.derived);

                var setMethod = (model instanceof baseCollection) ? "reset" : "set";
                return model[setMethod](attrs, { silent: true });
            };

            module[jsonMethodName] = function(overrides) {
                return safeExtend(deepClone(saveParsedJson(name, parentName)), overrides, name);
            };
        }

        _.each(fixtureModule.definitions, function(definition, name) {
            if (definition.children) {
                fixtureModule[name] = {};
                initializeChildDefinitions(definition);
                _.each(definition.children, function(innerDefinition, innerName) {
                    generateFixture(innerDefinition, innerName, name);
                });
            } else {
                generateFixture(definition, name);
            }
        });
    }

    window.backboneFixtures = {
        definitions: window.BackboneFixtureDefinitions,
        parsedJson: {},
        rawJsonPathPrefix: "backbone"
    };

    window.backboneFixtures.safeExtend = safeExtend;
    window.backboneFixtures.addUniqueDefaults = addUniqueDefaults;

    defineAllFixtures(window.backboneFixtures);
};
