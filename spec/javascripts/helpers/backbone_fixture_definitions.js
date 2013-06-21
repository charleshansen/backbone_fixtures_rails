BackboneFixtureDefinitions = {

    test: {
        model:   "User",
        unique: [ "id" ],

        children: {
            noOverrides: {},
            withOverrides: { model: "Workspace" }
        }
    },

    user: { unique: ["id"] },

    userSet: { unique: ["id"] }
};

