require 'lib/fixture_middleware'

Jasmine.configure do |config|
  config.add_rack_path('/__fixtures', lambda { BackboneFixtures::FixtureMiddleware.new })
end