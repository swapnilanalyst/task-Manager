import Chance from "chance";

describe("Task Manager - Registration Page Test Cases", () => {
  const baseUrl = "http://taskmanager.salesninjacrm.com/sign-up";
  const chance = new Chance();

  const locators = {
    orgName: "input[name='organizationName']",
    email: "input[name='email']",
    mobileNumber: "input[name='mobileNumber']",
    address: "input[name='address']",
    country: "input[placeholder='Choose a country']",
    state: "input[name='state']",
    city: "input[name='city']",
    pincode: "input[name='pincode']",
    industryType: "input[name='industryType']",
    website: "input[name='website']",
    Createriganization: "button[type='submit']",
    countryCodeSelected: "selector-for-selected-country-code",
    countryCodeButton: "#country-list-button",
    cc: ".minimal__flag__icon__root",
    errorMsg: "selector-for-error-message",
    SaveWorkspace: "button[type='submit']",
  };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  // it("TC_01 - UI Validation: All fields visible", () => {
  //   cy.get(locators.orgName).should("be.visible");
  //   cy.get(locators.email).should("be.visible");
  //   cy.get(locators.mobileNumber).should("be.visible");
  //   cy.get(locators.address).should("be.visible");
  //   cy.get(locators.country).should("be.visible");
  //   cy.get(locators.state).should("be.visible");
  //   cy.get(locators.city).should("be.visible");
  //   cy.get(locators.pincode).should("be.visible");
  //   cy.get(locators.industryType).should("be.visible");
  //   cy.get(locators.website).should("be.visible");
  //   cy.get(locators.Createriganization).should("be.visible");
  // });

  // it("TC_02 - Mandatory Field Validation", () => {
  //   // Trigger the "Create Organization" button
  //   cy.contains("Create Organization").click();
  //   cy.get(
  //     ".MuiFormHelperText-root.Mui-error.MuiFormHelperText-sizeMedium.MuiFormHelperText-contained.css-15piqkk"
  //   )
  //     .each(($el) => {
  //       // Log the inner text of each element
  //       cy.log($el.text());
  //       console.log($el.text());
  //     })
  //     .should("have.length.greaterThan", 0);
  // });
  // it("TC_03 - Name Field Validation", () => {
  //   cy.get(locators.orgName).type("1234!@#");
  //   cy.contains("Create Organization").click();
  //   cy.contains("Email is required!").should("exist");
  // });

  // it("TC_04 - Email Format Validation", () => {
  //   cy.get(locators.email).type("user@");
  //   cy.contains("Create Organization").click();
  //   cy.contains("Email must be a valid email address!").should("exist");
  // });

  // it("TC_05 - Mobile Number Validation for default selected country India", () => {
  //   cy.get(locators.countryCodeButton)
  //     .find("img.minimal__flag__icon__img")
  //     .invoke("attr", "alt")
  //     .then((countryCode) => {
  //       cy.log(`Selected country code: ${countryCode}`);
  //       expect(countryCode).to.equal("IN"); // Optional: ensure India is selected
  //       // If India selected, mobile must be exactly 10 digits
  //       // Enter less than 10 digits (invalid)
  //       cy.get(locators.mobileNumber).clear().type("1234567");
  //       cy.get(locators.Createriganization).click();
  //       cy.contains("Mobile number must be at least 10 digits").should("exist");

  //       // Enter exactly 10 digits (valid)
  //       cy.get(locators.mobileNumber).clear().type("1234567890");
  //       cy.get(locators.Createriganization).click();
  //       cy.contains("Mobile number must be at least 10 digits").should(
  //         "not.exist"
  //       );
  //     });
  // });

  // it("TC_05.01 - Mobile Number Validation for other countries", () => {
  //   // Open country dropdown and select US (or any other country)
  //   cy.get(locators.countryCodeButton).click();
  //   cy.get('ul[role="menu"] li') // Adjust locator if needed
  //     .contains("United States") // or the exact text in the country list
  //     .click()
  //     .wait(500); // wait for selection to register

  //   // Now confirm selected country is US
  //   cy.get(locators.countryCodeButton)
  //     .find("img.minimal__flag__icon__img")
  //     .invoke("attr", "alt")
  //     .then((countryCode) => {
  //       cy.log(`Selected country code: ${countryCode}`);
  //       expect(countryCode).to.equal("US"); // Optional check

  //       // For other countries: allow 15-20 digits max

  //       // Enter 15 digits (valid)
  //       cy.get(locators.mobileNumber).clear().type("123456789012345");
  //       cy.get(locators.Createriganization).click();
  //       cy.contains("Mobile number must be at least 10 digits").should("exist");

  //       // Enter more than 20 digits (invalid)
  //       cy.get(locators.mobileNumber).clear().type("1234567890123456789012345"); // 25 digits
  //       cy.get(locators.Createriganization).click();
  //       cy.contains("Mobile number cannot exceed 20 digits").should("exist");

  //       // Enter valid number with exactly 20 digits
  //       cy.get(locators.mobileNumber).clear().type("12345678901234567890");
  //       cy.get(locators.Createriganization).click();
  //       cy.contains("Mobile number cannot exceed 20 digits").should(
  //         "not.exist"
  //       );
  //     });
  // });

  // it("TC_06 - Address Field Validation", () => {
  //   cy.get(locators.address).type("123 Main St. Apt #5");
  //   cy.get(locators.Createriganization).click();
  //   // Assuming no error is shown for a valid address
  //   cy.get(locators.address).should("have.value", "123 Main St. Apt #5");
  // });

  // it("TC_07 - Country Selection", () => {
  //   cy.get(locators.country).click().type("India");
  //   cy.wait(500); // You can adjust the wait time if needed
  //   // Click the 'India' option from the dropdown
  //   cy.get('ul[role="listbox"]') // Make sure this matches the correct dropdown selector
  //     .contains("India") // Adjust the text to match the displayed text in the dropdown
  //     .click();

  //   // Verify that 'India' is selected
  //   cy.get(locators.country).should("have.value", "India");
  // });

  // it("TC_08 - State Field Validation", () => {
  //   cy.get(locators.state).type("Madhya Pradesh");
  //   cy.contains("Create Organization").click();
  //   cy.get(locators.state).should("have.value", "Madhya Pradesh");
  // });

  // it("TC_09 - City Field Handling", () => {
  //   cy.get(locators.city).type("Indore");
  //   cy.contains("Create Organization").click();
  //   cy.get(locators.city).should("have.value", "Indore");
  // });

  // it("TC_10 - Postal Code Field Should Not Be Empty", () => {
  //   // Leave postal code blank
  //   cy.get(locators.pincode).should("exist").clear();
  //   cy.contains("Create Organization").click();

  //   // Assertion for empty validation error
  //   cy.contains("Pincode is required!").should("exist"); // <- adjust message based on actual UI
  // });

  // it("TC_11 - Industry Type Field", () => {
  //   cy.get(locators.industryType).type("Indore");
  //   cy.contains("Create Organization").click();
  //   cy.get(locators.industryType).should("have.value", "Indore");
  // });

  // it("TC_12 - Website URL Validation (Optional but Should Validate if Filled)", () => {
  //   cy.get(locators.website).type("invalidurl");
  //   cy.contains("Create Organization").click();

  //   // Ideally this should exist in the future
  //   cy.contains("Website must be a valid url").should("exist"); // May fail if not implemented yet
  // });

  // it("TC_13 - Terms & Conditions Checkbox", () => {
  //   cy.get(locators.orgName).type("John Doe");
  //   cy.get(locators.email).type("john@example.com");
  //   cy.get(locators.mobileNumber).type("9876543210");
  //   cy.get(locators.address).type("123 Main Street");
  //   cy.get(locators.country).click().type("India");
  //   cy.get('ul[role="listbox"]') // Make sure this matches the correct dropdown selector
  //     .contains("India") // Adjust the text to match the displayed text in the dropdown
  //     .click();
  //   //   cy.get("input[placeholder='Enter State']").type('MP');
  //   //   cy.get("input[placeholder='Search city...']").type('Indore');
  //   cy.get(locators.pincode).type("452001");
  //   cy.get(locators.industryType)
  //     .type("Finance")
  //     .should("have.value", "Finance");
  //   cy.get(locators.website).type("https://company.com");
  //   cy.wait(500);
  //   // Don't check T&C
  //   cy.contains("Create Organization").click();
  //   //   cy.contains('Please read and accept the Terms of Service & Privacy Policy before continuing.').should('exist');
  // });

  // it("TC_14 - Successful Registration witout verification", () => {
  //   const timestamp = Date.now();
  //   const email = `user${timestamp}@mailinator.com`; // Random email
  //   const addRess = chance.address();
  //   const username = chance.name(); // Random name
  //   const phone = chance.phone(); // Random phone number

  //   console.log(username, phone);
  //   cy.log(username, phone);

  //   cy.get(locators.orgName).type(username);
  //   cy.get(locators.email).type(email);
  //   cy.get(locators.mobileNumber).type(phone);
  //   cy.get(locators.address).type(addRess);
  //   cy.get(locators.country).click().type("India");
  //   cy.get('ul[role="listbox"]').contains("India").click();
  //   //   cy.get("input[placeholder='Enter State']").type('MP');
  //   //   cy.get("input[placeholder='Search city...']").type('Indore');
  //   cy.get(locators.pincode).type("452001");
  //   cy.get(locators.industryType)
  //     .type("CypressTesting")
  //     .should("have.value", "CypressTesting");
  //   cy.get(locators.website).type("https://company.com");
  //   cy.wait(5000);
  //   //   cy.get("input[type='checkbox']").check();
  //   cy.contains("Create Organization").click();

  //   // Now checking the success Alert Message with dynamic Org ID
  //   cy.get(".MuiAlert-root", { timeout: 10000 })
  //     .should("be.visible")
  //     .and("contain.text", "Your account has been successfully created.")
  //     .and("contain.text", "Please check your email for verification.")
  //     .then(($toastMessage) => {
  //       const alertText = $toastMessage.text();

  //       //Regular expression to match the dynamic Organization ID pattern
  //       const orgIdPattern = new RegExp(
  //         `${username.slice(0, 3).toUpperCase()}-\\d{4}-\\d{4}`
  //       );

  //       cy.log("Extracted Alert Text: ", alertText);
  //       console.log("Extracted org: ", orgIdPattern);

  //       // Check if the Organization ID in the message matches the expected pattern
  //       expect(alertText).to.match(orgIdPattern);
  //     });
  //   //Workspace Pop-up validation
  //   cy.get("div[role='dialog']", { timeout: 10000 })
  //     .should("be.visible")
  //     .and(
  //       "contain.text",
  //       "Welcome to Task Manager ! Let's set up your Workspace."
  //     );
  //   cy.get('input[type="text"]').should("be.visible").type("Cypress Workspace");
  //   cy.get(locators.SaveWorkspace).contains("Save").click();
  // });

  // it("TC_15 - Successful Registration with Verification", () => {
  //   const timestamp = Date.now();
  //   const email = `user${timestamp}@mailinator.com`;
  //   const addRess = chance.address();
  //   const username = chance.name();
  //   const phone = chance.phone();

  //   // Step 1: Fill Registration Form
  //   cy.get(locators.orgName).type(username);
  //   cy.get(locators.email).type(email);
  //   cy.get(locators.mobileNumber).type(phone);
  //   cy.get(locators.address).type(addRess);
  //   cy.get(locators.country).click().type("India");
  //   cy.get('ul[role="listbox"]').contains("India").click();
  //   cy.get(locators.pincode).type("452001");
  //   cy.get(locators.industryType).type("CypressTesting");
  //   cy.get(locators.website).type("https://company.com");
  //   cy.wait(5000);
  //   cy.contains("Create Organization").click();

  //   // Step 2: Verify Success Alert
  //   cy.get(".MuiAlert-root", { timeout: 10000 })
  //     .should("be.visible")
  //     .and("contain.text", "Your account has been successfully created.")
  //     .and("contain.text", "Please check your email for verification.");

  //   // Step 3: Workspace Setup
  //   cy.get("div[role='dialog']", { timeout: 10000 })
  //     .should("exist")
  //     .and(
  //       "contain.text",
  //       "Welcome to Task Manager ! Let's set up your Workspace."
  //     );
  //   cy.get('input[type="text"]').type("Cypress Workspace");
  //   cy.get(locators.SaveWorkspace).contains("Save").click();

  //   // Step 4: Mailinator flow (cross-origin)
  //   const userEmailPrefix = email.split("@")[0];

  //   cy.origin(
  //     "https://www.mailinator.com",
  //     { args: { userEmailPrefix } },
  //     ({ userEmailPrefix }) => {
  //       const mailinatorUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${userEmailPrefix}`;
  //       cy.visit(mailinatorUrl);

  //       // Wait for email to arrive
  //       cy.contains("td", "Verify your email address to complete Signup", {
  //         timeout: 30000,
  //       })
  //         .should("be.visible")
  //         .click();

  //       // Switching to iframe to access email content
  //       cy.get("iframe#html_msg_body")
  //         .its("0.contentDocument.body")
  //         .should("not.be.empty")
  //         .then(cy.wrap)
  //         .find("a[href*='verify']")
  //         .should("have.attr", "href")
  //         .then((verifyUrl) => {
  //           // Verification link
  //           cy.visit(verifyUrl);
  //         });
  //     }
  //   );

  //   //Verify Thank You page
  //   cy.url().should("include", "/thank-you");
  //   cy.contains("Thank you!").should("be.visible");
  // });

it("TC_16 - Successful Registration with Verification & Login", () => {
  const timestamp = Date.now();
  const email = `user${timestamp}@mailinator.com`;
  const addRess = chance.address();
  const username = chance.name();
  const phone = chance.phone();

  // Step 1: Fill Registration Form
  cy.get(locators.orgName).type(username);
  cy.get(locators.email).type(email);
  cy.get(locators.mobileNumber).type(phone);
  cy.get(locators.address).type(addRess);
  cy.get(locators.country).click().type("India");
  cy.get('ul[role="listbox"]').contains("India").click();
  cy.get(locators.pincode).type("452001");
  cy.get(locators.industryType).type("CypressTesting");
  cy.get(locators.website).type("https://company.com");
  cy.wait(5000);
  cy.contains("Create Organization").click();

  // Step 2: Verify Success Alert
  cy.get(".MuiAlert-root", { timeout: 10000 })
    .should("be.visible")
    .and("contain.text", "Your account has been successfully created.")
    .and("contain.text", "Please check your email for verification.");

  // Step 3: Workspace Setup
  cy.get("div[role='dialog']", { timeout: 10000 })
    .should("exist")
    .and(
      "contain.text",
      "Welcome to Task Manager ! Let's set up your Workspace."
    );
  cy.get('input[type="text"]').type("Cypress Workspace");
  cy.get(locators.SaveWorkspace).contains("Save").click();

  // Step 4: Mailinator - Verify Account
  const userEmailPrefix = email.split("@")[0];
  cy.origin("https://www.mailinator.com", { args: { userEmailPrefix } }, ({ userEmailPrefix }) => {
    const mailinatorUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${userEmailPrefix}`;
    cy.visit(mailinatorUrl);

    cy.contains("td", "Verify your email address to complete Signup", { timeout: 30000 })
      .should("be.visible")
      .click();

    cy.get("iframe#html_msg_body")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .find("a[href*='verify']")
      .should("have.attr", "href")
      .then((verifyUrl) => {
        cy.visit(verifyUrl); // Verification link
      });
  });

  // Step 5: Verify Thank You page
  cy.url().should("include", "/thank-you");
  cy.contains("Thank you!").should("be.visible");

  // Step 6: Mailinator - Fetch Credentials Mail
  let extractedUser, extractedPass;

  cy.origin("https://www.mailinator.com", { args: { userEmailPrefix } }, ({ userEmailPrefix }) => {
    const mailinatorUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${userEmailPrefix}`;
    cy.visit(mailinatorUrl);
    cy.wait(5000); // Wait for email to arrive
    cy.contains("td", "Welcome to TaskManager - Your Account is Now Verified", {
      timeout: 30000,
    }).should("be.visible").click();

    cy.get("iframe#html_msg_body")
      .its("0.contentDocument.body")
      .should("not.be.empty")
      .then(cy.wrap)
      .within(() => {
        cy.contains("p", "Email :").invoke("text").then((text) => {
          extractedUser = text.replace("Email :", "").trim();
          cy.log("Extracted Email:", extractedUser);
        });

        cy.contains("p", "Password :").invoke("text").then((text) => {
          extractedPass = text.replace("Password :", "").trim();
          cy.log("Extracted Password:", extractedPass);
        });

        cy.contains("a", "Login Now")
          .invoke("attr", "href") // Ensure it's the correct link
          .then((href) => {
            loginHref = href;   // ✅ assign to outer variable
            cy.log("Extracted Login Link:", loginHref);
          });

      });
  });

  // ✅ Back to AUT origin for login (no need for cy.origin() here)
  cy.then((loginHref) => {
    // Visit the login page directly (no need for cy.origin here)
    cy.visit(loginHref);

    cy.get("input[name='email']").type(extractedUser);
    cy.get("input[name='password']").type(extractedPass);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome").should("be.visible");
  });
});

});
