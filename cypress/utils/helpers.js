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

// 🔹 5. Get trimmed text of an element
export function getText(selector, expectedText = null) {
  return cy.get(selector).invoke("text").then((t) => {
    const trimmed = t.trim();
    cy.log("Actual Text: " + trimmed);

    if (expectedText) {
      expect(trimmed).to.equal(expectedText);
    }

    return cy.wrap(trimmed);   // 🔥 FIX — return wrapped value
  });
}


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
  const [day, month, year] = date.split("/").map(Number);

  // Month names list (to match header text)
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Open calendar input
  cy.get('input[name="joiningDate"]').click({ force: true });

  // Get current month and year from calendar header
  cy.get('.MuiPickersCalendarHeader-label').invoke('text').then(header => {
    const [curMonth, curYear] = header.split(" ");
    const curMonthIndex = monthNames.indexOf(curMonth);
    const curYearNum = parseInt(curYear);
    const targetMonthIndex = month - 1;

    // ✅ Step 1: If year is different, change year first
    if (curYearNum !== year) {
      cy.get('button[aria-label*="year view"], button[aria-label*="switch to year view"]').click({ force: true });
      cy.contains('button', year).click({ force: true });
    }

    // ✅ Step 2: Move to correct month if needed
    if (curMonthIndex !== targetMonthIndex) {
      const diff = targetMonthIndex - curMonthIndex;
      const direction = diff > 0 ? 'Next' : 'Previous';
      for (let i = 0; i < Math.abs(diff); i++) {
        cy.get(`button[aria-label="${direction} month"], button[title="${direction} month"]`)
          .click({ force: true });
      }
    }

    // ✅ Step 3: Pick the date (day)
    cy.contains('button.MuiPickersDay-root', new RegExp(`^${day}$`))
      .click({ force: true });

    cy.log(`✅ Selected date: ${date}`);
  });
};


export const waitForMail = (prefix, subject, timeout = 30000) => {
  return cy.origin(
    "https://www.mailinator.com",
    { args: { prefix, subject, timeout } },
    ({ prefix, subject, timeout }) => {
      const inboxUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${prefix}`;
      cy.visit(inboxUrl);
      cy.contains("td", subject, { timeout }).should("be.visible");
    }
  );
};

export const getVerifyLink = (
  prefix,
  subject = "Verify your email address to complete Signup",
  linkPart = "verify",
  timeout = 30000
) => {
  return cy.origin(
    "https://www.mailinator.com",
    { args: { prefix, subject, linkPart, timeout } },
    ({ prefix, subject, linkPart, timeout }) => {
      const inboxUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${prefix}`;
      cy.visit(inboxUrl);

      cy.contains("td", subject, { timeout }).click();

      cy.get("iframe#html_msg_body")
        .its("0.contentDocument.body")
        .should("not.be.empty")
        .then(cy.wrap)
        .find(`a[href*='${linkPart}']`)
        .invoke("attr", "href")
        .then((href) => cy.wrap(href));
    }
  );
};

export const fetchCredentials = (
  prefix,
  subject = "Welcome to TaskManager - Your Account is Now Verified",
  timeout = 30000
) => {
  return cy.origin(
    "https://www.mailinator.com",
    { args: { prefix, subject, timeout } },
    ({ prefix, subject, timeout }) => {
      const inboxUrl = `https://www.mailinator.com/v4/public/inboxes.jsp?to=${prefix}`;
      cy.visit(inboxUrl);

      cy.contains("td", subject, { timeout }).click();

      cy.get("iframe#html_msg_body")
        .its("0.contentDocument.body")
        .should("not.be.empty")
        .then(cy.wrap)
        .then(($body) => {
          const extract = (label) =>
            $body.find(`p:contains('${label}')`).text().replace(label, "").trim();

          const email = extract("Email :");
          const password = extract("Password :");
          const loginUrl = $body.find("a:contains('Login Now')").prop("href");

          cy.wrap({ email, password, loginUrl });
        });
    }
  );
};

// cypress/utils/cardHelper.js

// ✅ UPDATED: now supports custom alias (default old behaviour jaisa hi)
export const getCardByTarget = (cardLocator, target, alias = "selectedItem") => {
  return cy.get(cardLocator).then(($cards) => {
    let card;
    const index = Number(target);
    const isIndex = !Number.isNaN(index) && String(index) === String(target);

    cy.log(`Searching card by ${isIndex ? "index" : "text match"}: ${target}`);

    if (isIndex) {
      card = $cards.get(index);
    } else {
      const regex = new RegExp(target, "i");
      card = [...$cards].find((c) => regex.test(c.innerText));
    }

    if (!card) {
      throw new Error(`Card not found for target: ${target}`);
    }

    const fullText = card.innerText.trim();
    const primaryText = fullText.split("\n")[0].trim();

    cy.wrap(primaryText).as(alias);   // ⭐ alias configurable
    return cy.wrap(card);
  });
};


export const assertValueNotInList = (listLocator, expected) => {
  cy.get(listLocator).then($list => {
    const listText = $list.text();

    cy.log("===== ASSERTION REPORT =====");
    cy.log(`Expected NOT to find : ${expected}`);
    cy.log(`List Content        : ${listText}`);
    console.table({ Expected: expected, "List Content": listText });

    expect(listText.includes(expected)).to.be.false;
  });
};


export function assertValueInList(listSelector, expectedValue, mode ="equal") {
  cy.log(`🔎 Verifying value in list`);
  cy.log(`📌 List Selector: ${listSelector}`);
  cy.log(`📌 Expected Value: ${expectedValue}`);
  cy.log(`📌 Mode: ${mode}`);

  cy.get(listSelector)
    .then(($items) => {
      cy.log(`📋 Total items found: ${$items.length}`);

      let matchFound = false;

      $items.each((index, el) => {
        const actualText = el.innerText.trim();
        cy.log(`➡️ Item ${index + 1}: "${actualText}"`);

        let toCompareActual = actualText;
        let toCompareExpected = expectedValue;

        // Handle ellipsis ("Space_1234....")
        if (actualText.includes("…") || actualText.includes("...")) {
          toCompareActual = actualText.replace("…", "").replace("...", "").trim();
          toCompareExpected = expectedValue.substring(0, toCompareActual.length);
        }

        switch (mode) {
          case "equal":
            if (toCompareActual === toCompareExpected) matchFound = true;
            break;

          case "contains":
            if (toCompareActual.includes(toCompareExpected)) matchFound = true;
            break;

          case "startswith":
            if (toCompareActual.startsWith(toCompareExpected)) matchFound = true;
            break;

          default:
            throw new Error(`Unknown mode: ${mode}`);
        }
      });

      expect(matchFound, `Expected value "${expectedValue}" not found in list`).to.be.true;
      cy.log(`✅ Match Found → "${expectedValue}"`);
    });
}



export const assertValidation = (locator, expected, operator = "gte") => {
  cy.get(locator).then(($items) => {
    const count = $items.length;

    cy.log("===== LIST COUNT ASSERTION =====");
    cy.log(`Locator     : ${locator}`);
    cy.log(`Operator    : ${operator}`);
    cy.log(`Expected    : ${expected}`);
    cy.log(`Actual      : ${count}`);

    switch (operator) {
      case "gt":
        expect(count).to.be.greaterThan(expected);
        break;
      case "gte":
        expect(count).to.be.at.least(expected);
        break;
      case "eq":
        expect(count).to.eq(expected);
        break;
      case "lt":
        expect(count).to.be.lessThan(expected);
        break;
      case "lte":
        expect(count).to.be.at.most(expected);
        break;
      default:
        throw new Error(`Invalid operator '${operator}' in assertListCount`);
    }
  });
};


// ✅ NEW: Generic max-length assertion for any input / textarea
export const assertMaxLength = (selector, max) => {
  cy.get(selector)
    .invoke("val")
    .then((val) => {
      const length = (val || "").length;

      cy.log("===== MAX LENGTH ASSERTION =====");
      cy.log(`Selector : ${selector}`);
      cy.log(`Max      : ${max}`);
      cy.log(`Actual   : ${length}`);

      expect(length, `Value length should be <= ${max}`).to.be.at.most(max);
    });
};

// ✅ NEW: Type long text and verify it is trimmed to max length
export const typeWithMaxLengthCheck = (selector, text, max) => {
  cy.get(selector).clear().type(text);
  assertMaxLength(selector, max);
};

// ✅ NEW: Generic toast assertion for any module
export const assertToastMessage = (
  toastSelector,
  expected,
  mode = "contains" // "contains" | "equals" | "matches"
) => {
  cy.get(toastSelector, { timeout: 10000 })
    .should("be.visible")
    .invoke("text")
    .then((raw) => {
      const actual = (raw || "").trim();
      cy.log("===== TOAST ASSERTION =====");
      cy.log(`Expected (${mode}) : ${expected}`);
      cy.log(`Actual             : ${actual}`);

      switch (mode) {
        case "equals":
          expect(actual).to.eq(expected);
          break;
        case "matches":
          expect(actual).to.match(expected); // expected = RegExp
          break;
        default:
          expect(actual.toLowerCase()).to.include(
            String(expected).toLowerCase()
          );
      }
    });
};







