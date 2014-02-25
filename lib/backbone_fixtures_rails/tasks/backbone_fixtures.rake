unless Rails.env.production?
  require 'rspec/core/rake_task'
  desc 'Regenerate JSON fixtures for jasmine tests'
  RSpec::Core::RakeTask.new(:backbone_fixtures) do |t|
    options = ['--tag fixture']
    t.rspec_opts = options
    t.pattern = 'spec/controllers/**/*_spec.rb'
  end
end