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

* `models`: An object containing models that correspond to fixture files, e.g. `models = { User: userModel, Database: databaseModel, ... }`.
* `collections`: An object containing collections, just like the `models` object.
* `baseModel`: The default model to use if a fixture cannot find something appropriate in the `models` object.  A natural choice is `Backbone.Model`.
* `baseCollection`:  The default collection to use if a fixture cannot find something appropriate in the `collections` object.  A natural choice is `Backbone.Collection`.


## Usage

### Generate Fixtures

### Fixture Definitions

### backboneFixtures in jasmine




