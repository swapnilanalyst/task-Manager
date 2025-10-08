Feature: Dashboard Menu and Logo Verification

  Background:
    Given I am logged into the Task Manager dashboard

  @positive
  Scenario: Verify the logo is visible and redirects to dashboard
    When I check for the dashboard logo
    Then The logo should be visible
    When I click on the logo
    Then I should be redirected to the dashboard page

  @positive
  Scenario: Verify all menu items are visible with correct URLs
    When I get all the menu items
    Then Each menu item should have a valid URL

  @positive
  Scenario: Verify navigation of each menu item
    When I click on each menu item one by one
    Then Each page should load successfully

  @negative
  Scenario: Verify menu item does not navigate to wrong page
    When I click on "My Tasks"
    Then I should not be redirected to the "Project" page
