const { defineConfig } = require("cypress");
const webpack = require("@cypress/webpack-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  projectId: "4v6qct",

  env: {
    allure: true,
    allureResultsPath: "allure-results",
    // ⚠️ activeEnv & environments tum cypress.env.json se already de rahe ho,
    // isliye yahan dubara likhne ki need nahi hai.
  },

  e2e: {
    baseUrl: "http://taskmanager.salesninjacrm.com",
    specPattern: ["cypress/e2e/**/*.feature", "cypress/e2e/**/*.cy.js"],
    supportFile: "cypress/support/e2e.js",

    async setupNodeEvents(on, config) {
      // ✅ Cucumber plugin
      await addCucumberPreprocessorPlugin(on, config);

      // ✅ Allure writer
      allureWriter(on, config);

      // ✅ Webpack for .feature files
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

      // ✅ Tumhare existing custom tasks
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

      // ⭐ Yahan se Allure environment.properties auto-generate hoga
      const activeEnv = config.env.activeEnv || "dev";
      const envConfig =
        (config.env.environments && config.env.environments[activeEnv]) || {};

      on("before:run", () => {
        const lines = [
          `Tester=Swapnil Gupta`,
          `Environment=${activeEnv}`,
          `BaseURL=${envConfig.baseUrl || config.baseUrl || ""}`,
          `LoginPath=${envConfig.loginPath || ""}`,
          `DashboardPath=${envConfig.dashboardPath || ""}`,
          `SpacePath=${envConfig.SpacePath || ""}`,
          `SpaceDetailsPath=${envConfig.spaceDetailsPath || ""}`,
          `Platform=Cypress`,
        ];

        const allureDir = path.join(process.cwd(), "allure-results");
        if (!fs.existsSync(allureDir)) {
          fs.mkdirSync(allureDir, { recursive: true });
        }

        fs.writeFileSync(
          path.join(allureDir, "environment.properties"),
          lines.join("\n"),
          "utf-8"
        );
      });

      return config; // ⚠️ important
    },
  },
});
