module BackboneRailsFixtures
  module Generators
    class InstallGenerator < Rails::Generators::Base
      # Add stuff to jasmine.yml
      # Add stuff to jasmine_helper.rb

      source_root File.expand_path("../templates", __FILE__)

      def create_fixture_definitions
        template "backbone_fixture_definitions.js", "spec/javascripts/helpers/backbone_fixture_definitions.js"
      end
    end
  end
end

