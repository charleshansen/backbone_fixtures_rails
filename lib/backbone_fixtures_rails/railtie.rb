require 'rails/railtie'

module BackboneFixturesRails
  class Railtie < ::Rails::Railtie
    rake_tasks do
      load 'backbone_fixtures_rails/tasks/backbone_fixtures.rake'
    end
  end
end