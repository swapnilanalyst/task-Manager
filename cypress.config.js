const { defineConfig } = require("cypress");
const webpack = require("@cypress/webpack-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");

module.exports = defineConfig({
  projectId: '4v6qct',
  e2e: {
    baseUrl: "http://taskmanager.salesninjacrm.com",
    specPattern: ["cypress/e2e/**/*.feature", "cypress/e2e/**/*.cy.js"], // Only feature files
    supportFile: "cypress/support/e2e.js", // adjust if needed
    async setupNodeEvents(on, config) {
      // Hook Cucumber preprocessor
      await addCucumberPreprocessorPlugin(on, config);

      // Webpack for feature files
      on(
        "file:preprocessor",
        webpack({
          webpackOptions: {
            resolve: { extensions: [".ts", ".js"] },
            module: {
              rules: [
                {
                  test: /\.feature$/,
                  use: [
                    {
                      loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                      options: config,
                    },
                  ],
                },
              ],
            },
          },
        })
      );

      // Tasks for loginHref or auth
      let authData;
      on("task", {
        saveLoginHref(href) {
          global.loginHref = href;
          return null;
        },
        getLoginHref() {
          return global.loginHref || null;
        },
        setAuth({ user, pass, loginUrl }) {
          authData = { user, pass, loginUrl };
          return null;
        },
        getAuth() {
          return authData;
        },
      });

      return config; // ✅ very important
    },
  },
});
