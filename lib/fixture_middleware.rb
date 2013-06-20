module BackboneFixtures
  class FixtureMiddleware
    def call(env)
      response_lines = []
      Dir.glob("spec/javascripts/fixtures/**/*.json") do |file|
        fixture_name = file[("spec/javascripts/fixtures/".length)...(-(".json".length))]
        this_response = [%{<script type="application/json" data-fixture-path="#{fixture_name}">}]
        this_response << IO.read(file)
        this_response << %{</script>}
        response_lines << this_response.join()
      end
      [200, {"Content-Type" => "text/html"}, response_lines]
    end
  end
end
