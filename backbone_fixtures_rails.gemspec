# -*- encoding: utf-8 -*-
require_relative 'lib/backbone_fixtures_rails/version'

Gem::Specification.new do |s|
  s.name        = "backbone_fixtures_rails"
  s.version     = BackboneFixturesRails::VERSION
  s.authors     = ["Chorus"]
  s.summary     = "Create Backbone fixtures from Rails controllers"
  s.description = "Create Backbone fixtures from Rails controllers"

  s.files        = `git ls-files`.split("\n")
  s.license      = 'MIT'
  s.require_path = 'lib'
  s.add_dependency "railties", ">= 3.1"
  s.add_dependency "rspec"
  s.add_dependency "jasmine"
end