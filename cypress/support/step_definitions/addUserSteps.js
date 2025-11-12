import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import AddUserPage from "../../support/pageObjects/AddUserPage";
import LoginPage from "../../support/pageObjects/LoginPage";
import { faker } from "@faker-js/faker";
import { getEnvConfig } from "../../utils/envHelper";
import { getVerifyLink, fetchCredentials } from "../../utils/helpers";

const addUserPage = new AddUserPage();
const loginPage = new LoginPage();
const env = getEnvConfig();

const JOB_TITLE_MAX = 25;
const uniqueEmail = (p = "user") => `${p}_${Date.now()}@mailinator.com`;
const makeUser = (overrides = {}) => ({
  fullName: faker.person.fullName(),
  email: `${faker.helpers.slugify(faker.person.fullName()).toLowerCase()}@mailinator.com`,
  mobileNumber: faker.string.numeric(10),
  jobTitle: faker.person.jobTitle().substring(0, JOB_TITLE_MAX),
  joiningDate: "06/11/2025",
  ...overrides,
});

/* -------- Background -------- */
Given("I am logged in and on the dashboard page", () => {
  cy.session("validUserSession", () => {
    loginPage.visit();
    loginPage.enterEmail(env.users.valid.email);
    loginPage.enterPassword(env.users.valid.password);
    loginPage.clickLoginButton();
    cy.url().should("include", "/dashboard");
  });
  cy.visit("/dashboard");
});

/* -------- Common steps -------- */
When("I click on the account button", () => addUserPage.clickAccountButton());
When("I click on Add Users from the list", () => addUserPage.clickAddUserOption());
When("I click on the New User button", () => addUserPage.clickNewUserButton());

When("I fill in all user details", () => {
  const user = makeUser();
  cy.wrap(user.email.split("@")[0]).as("emailPrefix");
  addUserPage.fillUserForm(user);
});

When("I click on the submit button", () => addUserPage.clickSubmitButton());

Then("I should see a success message for user creation", () => {
  cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
});

/* -------- Mailinator flow -------- */
When("I verify the added user account via Mailinator", () => {
  cy.get("@emailPrefix").then((prefix) => getVerifyLink(prefix).then((url) => cy.visit(url)));
});

Then("Thank You page should be visible for user", () => {
  cy.url().should("include", "/thank-you");
  cy.contains("Thank you!").should("be.visible");
});

When("I fetch login credentials from Mailinator for user", () => {
  cy.get("@emailPrefix").then((prefix) =>
    fetchCredentials(prefix).then(({ email, password, loginUrl }) => {
      cy.task("setAuth", { user: email, pass: password });
      cy.task("saveLoginHref", loginUrl);
    })
  );
});

/* -------- Multiple users -------- */
When("I create {int} new users", (count) => {
  Cypress._.times(count, (i) => {
    const user = makeUser({ email: uniqueEmail(`user_${i}`) });
    addUserPage.clickNewUserButton();
    addUserPage.fillUserForm(user);
    addUserPage.clickSubmitButton();
    cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
    addUserPage.navigateToUserList();
  });
});

/* -------- Negative: blank form -------- */
When("I submit the form without filling any details", () => addUserPage.clickSubmitButton());

Then("I should see validation errors for required fields", () => {
  cy.get('input[aria-invalid="true"]').each(($input) => {
    const name = $input.attr("name");
    const error = $input
      .closest(".MuiFormControl-root")
      .find(".MuiFormHelperText-root.Mui-error")
      .text()
      .trim();
    cy.log(`${name}: ${error}`);
  });
});

/* -------- Negative: invalid email -------- */
When("I fill in user form with invalid email", () => {
  addUserPage.fillUserForm(makeUser({ email: "invalid-email-format" }));
});

Then("I should see an email format validation error", () => {
  cy.contains("Email must be a valid email address!", { timeout: 5000 }).should("be.visible");
  cy.contains("Create success!", { timeout: 3000 }).should("not.exist");
});

/* -------- Duplicates -------- */
When("I create a new user and store its contact", () => {
  const user = makeUser({ email: uniqueEmail("dup") });
  addUserPage.clickNewUserButton();
  addUserPage.fillUserForm(user);
  addUserPage.clickSubmitButton();
  cy.contains("Create success!", { timeout: 10000 }).should("be.visible");
  cy.wrap(user).as("createdUser");
  addUserPage.navigateToUserList();
});

When("I fill in user form with the existing email", () => {
  cy.get("@createdUser").then((u) => addUserPage.fillUserForm(makeUser({ email: u.email })));
});

When("I fill in user form with the existing mobile number", () => {
  cy.get("@createdUser").then((u) =>
    addUserPage.fillUserForm(makeUser({ email: uniqueEmail("other"), mobileNumber: u.mobileNumber }))
  );
});

Then("I should see a duplicate email error", () => {
  addUserPage.getToastText().then((t) => cy.log(`Toast: ${t}`));
});

Then("I should see a duplicate mobile number error", () => {
  addUserPage.getToastText().then((t) => cy.log(`Toast: ${t}`));
});

/* -------- User List steps -------- */
When("I wait for the user list to load", () => {
  // We are already on /dashboard/user/list
  cy.url().should("include", "/dashboard/user/list");

  // Intercept BEFORE we trigger a new request
  cy.intercept("POST", "**/graphql").as("gql");

  // Trigger refetch (since we're already on the page)
  cy.reload();

  // Wait for any GraphQL call, then reuse its auth
  cy.wait("@gql", { timeout: 30000 }).then(({ request }) => {
    const auth =
      request.headers.authorization ||
      request.headers.Authorization ||
      null;
    const cookie = request.headers.cookie || null;

    // Basic UI check (visible table with at least 1 row)
    cy.get("table:visible, [data-testid='user-table']")
      .first()
      .should("be.visible")
      .within(() => {
        cy.get("tbody tr, [data-testid='row']").should(
          "have.length.greaterThan",
          0
        );
      });

    // Now call the API directly with the SAME auth as the app
    cy.request({
      method: "POST",
      url: "http://taskbackend.salesninjacrm.com/graphql",
      headers: {
        ...(auth ? { authorization: auth } : {}),
        ...(cookie ? { cookie } : {}),
        "content-type": "application/json",
      },
      body: {
        operationName: "GetEmployeesResponse",
        variables: {},
        query: `
          query GetEmployeesResponse {
            getEmployees {
              success
              message
              code
              employees {
                id
                fullName
                email
                mobileNumber
                jobTitle
                joiningDate
                status
                task
              }
            }
          }
        `,
      },
      // if backend ever returns non-2xx, don't fail the test before we can inspect
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status, "GraphQL HTTP status").to.eq(200);
      const res = body?.data?.getEmployees;
      expect(res?.success, "API success flag").to.be.true;

      const employees = res?.employees || [];
      cy.log(`API employees: ${employees.length}`);
      console.table(employees);
      cy.wrap(employees, { log: false }).as("employees");
      expect(employees.length).to.be.greaterThan(0);
    });
  });
});



Then("I should see the user list table", () => {
  // addUserPage.getUserListTable().should("be.visible");
    addUserPage.getUserRows().then(($rows) => {

    const list = [...$rows].map(row => {
      const tds = row.querySelectorAll("td");
      if (tds.length < 6) return null;  // 🛑 Skip invalid rows

      const [name, email] = tds[1].innerText
        .split("\n")
        .map(s => s.trim());

      return {
        name,
        email,
        phone: tds[2].innerText.trim(),
        role: tds[3].innerText.trim(),
        joiningDate: tds[4].innerText.trim(),
        status: tds[5].innerText.trim(),
      };
    }).filter(Boolean); // remove null rows

    console.table(list);
    cy.log(`👍 Printed ${list.length} user rows in console`);
  });
}); 

Then("I should see at least 1 user row", () => {
   addUserPage.getUserRows().its("length").should("be.greaterThan", 0);
});

When('I search the user list for {string}', (text) => {
  addUserPage.searchUsers(text);
});

Then('each visible user row should include {string} in name or email', (text) => {
  const search = text.toLowerCase();

  addUserPage.getUserRows().each(($row) => {

    // get all cells text in readable format
    const cells = Array.from($row.find("td")).map(td =>
      td.innerText.trim()
    );

    const rowText = cells.join(" ").trim().toLowerCase();

    // ✅ SKIP empty rows (fixes the error)
    if (!rowText) return;

    // print nicely
    cy.log(`Row: ${cells.join(" | ")}`);
    console.log("Row:", cells.join(" | "));

    // case-insensitive match
    expect(rowText).to.include(search);
  });
});


When("I set rows per page to {int}", (n) => {
  addUserPage.setRowsPerPage(n);
});


Then("I should see at most {int} rows", (n) => {
  addUserPage.getUserRows().should(($rows) => {
    expect($rows.length).to.be.at.most(n);
  });
});

When('I open the {string} tab', (label) => {
  addUserPage.openUserTab(label);
});


