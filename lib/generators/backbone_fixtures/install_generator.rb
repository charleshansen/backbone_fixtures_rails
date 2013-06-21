module BackboneRailsFixtures
  module Generators
    class InstallGenerator < Rails::Generators::Base
      # Add stuff to jasmine.yml

      source_root File.expand_path("../templates", __FILE__)

      def create_fixture_definitions
        template "backbone_fixture_definitions.js", "spec/javascripts/helpers/backbone_fixture_definitions.js"
      end

      def instruct_to_add_jasmine_config
        puts "Copy the following line(s) into your jasmine_helper.rb:\n"
        puts "Jasmine.configure do |config|"
        puts "  config.add_rack_path('/__fixtures', lambda { BackboneFixtures::FixtureMiddleware.new })"
        puts "end"
      end
    end
  end
end

