// cypress/support/helpers/APIHelper.js

class APIHelper {
  /**
   * 1) Get Auth Token from browser storage
   */
  static getAuthToken() {
    return cy.window().then((win) => {
      const token =
        win.localStorage.getItem("jwt_access_token") ||
        win.sessionStorage.getItem("jwt_access_token");

      if (!token) {
        throw new Error("❌ Token not found in localStorage/sessionStorage");
      }

      // Cypress command nahi, direct Cypress.log (async issue nahi aayega)
      Cypress.log({
        name: "AUTH",
        message: `Using token (first 20 chars): ${token.slice(0, 20)}...`,
      });

      // Sirf normal value return – safe
      return token;
    });
  }

  /**
   * 2) Universal GraphQL API Caller + deep path extractor
   *
   * Example path: "data.getSpaceInfo.Space[0].taskInfo.tasks"
   */
  static fetchAndExtract({ url, query, variables = {}, path, token }) {
    return cy
      .request({
        method: "POST",
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          query,
          variables,
        },
      })
      .then((res) => {
        // 4xx/5xx handle (optional)
        if (res.status < 200 || res.status >= 300) {
          throw new Error(
            `❌ API failed with status ${res.status}: ${JSON.stringify(
              res.body
            )}`
          );
        }

        const finalData = path
          .split(".")
          .reduce((obj, key) => (obj ? obj[key] : undefined), res.body);

        Cypress.log({
          name: "API",
          message: `Extracted: ${path}`,
          consoleProps: () => ({
            status: res.status,
            response: res.body,
            extracted: finalData,
          }),
        });

        return finalData;
      });
  }

  /**
   * 3) Print table-like data from array of objects
   *    fields = ["title", "status", "startDate", "dueDate"]
   */
  static printDataTable(data, fields) {
    const rows = Array.isArray(data) ? data : [data];

    cy.log("────────────── 📁 API DATA TABLE ──────────────");

    rows.forEach((item, i) => {
      const row = fields.map((f) => item[f]).join(" | ");
      cy.log(`Row ${i + 1} → ${row}`);
      cy.log("Item JSON → " + JSON.stringify(item));
      cy.log("Fields → " + fields.join(", "));
    });

    cy.log("──────────────────────────────────────────────");
  }

  /**
   * 4) Optional helper: compare API list length vs UI table rows
   */
  static assertRowCountMatches(selector, expectedLength) {
    cy.get(selector).should("have.length", expectedLength);
  }
}

export default APIHelper;
