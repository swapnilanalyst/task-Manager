// ===========================================================
// 📦 Helper Functions — Cypress Reusable Utility Library
// Author: Swapnil QA
// ===========================================================

// 🔹 1. Wait for an element to be visible (like explicit wait in Selenium)
export const waitForElementVisibility = (selector, timeout = 5000) => {
  cy.get(selector, { timeout }).should('be.visible');
};

// 🔹 2. Click an element using JavaScript (useful for hidden elements)
export const clickByJS = (selector) => {
  cy.window().then((win) => {
    const element = win.document.querySelector(selector);
    element?.click();
  });
};

// 🔹 3. Get an element's text using JavaScript
export const getTextByJS = (selector) => {
  return cy.window().then((win) => {
    const element = win.document.querySelector(selector);
    return element?.innerText;
  });
};

// 🔹 4. Select dropdown by visible text (for native <select>)
export const selectDropdownByVisibleText = (selector, text) => {
  cy.get(selector).select(text);
};

// 🔹 5. Switch to a new tab (simulate tab switching)
export const switchToNewTab = () => {
  cy.window().then((window) => {
    const newTab = window.open();
    window.focus();
    cy.wrap(newTab).should('exist');
  });
};

// 🔹 6. Handle Bootstrap-like dropdown
export const selectFromBootstrapDropdown = (dropdownSelector, optionText) => {
  cy.get(dropdownSelector).click();
  cy.contains(optionText).click();
};

// 🔹 7. Set value in an input field using JavaScript
export const setInputValueByJS = (selector, value) => {
  cy.window().then((win) => {
    const element = win.document.querySelector(selector);
    if (element) element.value = value;
  });
};

// 🔹 8. Scroll element into view
export const scrollIntoView = (selector) => {
  cy.get(selector).scrollIntoView();
};

// 🔹 9. Highlight element using JavaScript (for debugging)
export const highlightElement = (selector, color = 'yellow') => {
  cy.window().then((win) => {
    const element = win.document.querySelector(selector);
    if (element) element.style.border = `2px solid ${color}`;
  });
};

// 🔹 10. Get page title using JavaScript
export const getPageTitleByJS = () => {
  return cy.window().then((win) => win.document.title);
};

// ===========================================================
// 📅 11. Select a date from a Material UI calendar (format: DD/MM/YYYY)
// ===========================================================

// cypress/utils/helpers.js

export const selectDate = (date) => {
  if (!date || typeof date !== "string" || !date.includes("/")) {
    cy.log("⚠️ Invalid or missing date passed to selectDate helper.");
    return;
  }

  const [day, month, year] = date.split("/").map((p) => p.trim());
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const targetMonth = monthNames[parseInt(month) - 1];

  // 🔹 Step 1: Open calendar
  cy.get('input[name="joiningDate"]').should('be.visible').click({ force: true });

  // 🔹 Step 2: Wait for the datepicker dialog
  cy.get('div[role="presentation"], div[role="dialog"]', { timeout: 7000 })
    .should('be.visible');

  // 🔹 Step 3: Ensure the header (month/year) is visible
  cy.get('.MuiPickersCalendarHeader-label, .MuiPickersToolbar-title', { timeout: 7000 })
    .should('be.visible')
    .then(($label) => {
      const headerText = $label.text();

      // 🔹 Step 4: Adjust Year if needed
      if (!headerText.includes(year)) {
        cy.get('button[aria-label*="year view"], button[aria-label*="switch to year view"]').click({ force: true });
        cy.contains('.MuiPickersYear-root button, button.MuiPickersYear-yearButton', year).click({ force: true });
      }

      // 🔹 Step 5: Adjust Month if needed
      cy.get('.MuiPickersCalendarHeader-label, .MuiPickersToolbar-title', { timeout: 5000 })
        .then(($header) => {
          const currentMonth = $header.text().split(" ")[0];
          if (currentMonth !== targetMonth) {
            // Case-insensitive selectors for next/prev month
            cy.get('button[aria-label="Next month"], button[title="Next month"]', { timeout: 5000 })
              .click({ force: true })
              .then(() => cy.wait(500)); // small pause for UI transition
          }
        });

      // 🔹 Step 6: Select Day
      cy.contains('button.MuiPickersDay-root', new RegExp(`^${day}$`))
        .should('be.visible')
        .click({ force: true });

      cy.log(`✅ Selected date: ${date}`);
    });
};

