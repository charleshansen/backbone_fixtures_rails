# Welcome to Backbone Fixtures Rails

This library is for creating fixtures for Backbone models and collections that are in sync with api responses from a rails server.

## Setup

Include gem in your `Gemfile`

``` ruby
gem 'backbone_fixtures_rails', :github => "pivotal-chorus/backbone_fixtures_rails"
```

Run the generator

``` sh
rails g backbone_fixtures_rails:install
```

This will instruct you to add the following lines to `spec/javascripts/support/jasmine_helper.rb`

``` ruby
Jasmine.configure do |config|
  config.add_rack_path('/__fixtures', lambda { BackboneFixtures::FixtureMiddleware.new })
end
```

Add the fixture generator to your `jasmine.yml`

``` yml
src_files:
  - assets/backbone_fixtures.js
```

Generate fixtures in `spec_helper.js`

``` js
beforeEach(function() {
    BackboneFixtures.jasmineSetup(models, collections, baseModel, baseCollection);
});
```

The arguments are as follows:

| Argument         | Description   |
| ---------------- |:------------- |
| `models`         | An object containing models that correspond to fixture files, e.g. `models = { User: userModel, Database: databaseModel, ... }` |
| `collections`    | An object containing collections, just like the `models` object.      |
| `baseModel`      | The default model to use if a fixture cannot find something appropriate in the `models` object.  A natural choice is `Backbone.Model`.  |
| `baseCollection` | The default collection to use if a fixture cannot find something appropriate in the `collections` object.  A natural choice is `Backbone.Collection`.     |


## Usage

### Generate Fixtures

To synchronize your backbone fixtures with your rails API, you must create json files using controller specs.  To do so, create specs like

```ruby
require 'spec_helper'

describe UsersController do
  # ...

  generate_fixture "user.json" do
    get :show, :id => 1
  end

  generate_fixture "specialUser.json" do
    get :show, :id => 2
  end

  generate_fixture "administrators/manager.json" do
    get :show, :id => 3
  end

  generate_fixture "administrators/superUser.json" do
    get :show, :id => 4
  end

  generate_fixture "userSet.json" do
    get :index
  end
end
```

When you run these specs, json files will be generated that jasmine can now use. You can also generate them by running:

``` sh
rake backbone_fixtures
```

### Fixture Definitions

To map the generated json files to Backbone objects, you need to define the relation between them in `spec/javascripts/helpers/backbone_fixture_definitions.js`.  It should look like

``` js
BackboneFixtureDefinitions = {
    user: { unique: ["id"] },

    userSet: { unique: ["id"] },

    specialUser: { model: "User", unique: ['id', 'handshake'] },

    administrators: {
        unique: ['id']
        children: {
            manager: { model: "User" }
            superUser: { model: "User" }
        }
    }

}
```

Keywords in this file are

| Keyword         | Description   |
| ---------------- |:------------- |
| `model`         | The model class to use (from the `models` object in `spec_helper.js`).  This will default to the capitalized name of the json file (without the '.json') |
| `collection` | The collection class to use (from the `collections` object in `spec_helper.js`).  This will default to the capitalized name of the json file (without the '.json')  |
| `unique`    | The list of attributes that should be unique.  Each instance of a fixture will generate a unique value for any attributes marked as unique and will ignore the value of the attribute in the json file |
| `children`      | If you have a series of related json files in a folder, you can group them by defining the folder as a fixture and giving it the children keyword.  Each entry in the children object should look like a normal fixture definition, but will inherit attributes from the parent fixture |


### backboneFixtures in jasmine

To access your fixtures in a jasmine test, there is a backboneFixtures object

``` js
describe("user spec", function() {
    it("tests users", function() {
        var user1 = backboneFixtures.user();
        var user2 = backboneFixtures.specialUser({name: "Special"});
        var manager = backboneFixtures.administrators.manager({mood: "amused"});
        expect(user1.get("name")).not.toEqual(user2.get("name"));
        expect(manager.get("mood")).toBe("amused");
    });
});
```

Note that if you pass an attribute to the fixture function that does not exist in the json file, you will get an error. For example:

``` js
describe("another spec", function() {
    it("throws an error", function() {
        // The line below will fail with this error: "The fixture 'user' has no key 'nonExistentKey'".
        var user = backboneFixtures.user({nonExistentKey: "value"});
    });
});
```