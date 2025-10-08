Feature: Task Manager Registration Page

  Background:
    Given I am on the registration page

  @UI
  Scenario: TC_01 - Validate all fields visibility
    Then all fields should be visible

  @Validation
  Scenario: TC_02 - Validate mandatory fields
    When I click Create Organization without filling fields
    Then mandatory field validation messages should be displayed

  @Validation
  Scenario: TC_04 - Validate invalid email format
    When I enter invalid email "user@"
    Then I should see invalid email error message

  @Positive
  Scenario: TC_05 - Successful Registration without verification
    When I fill valid organization details
    And I submit the registration form
    Then a success alert should appear
    And workspace setup modal should appear

  @Integration
  Scenario: TC_06 - Successful Registration with verification
    When I fill valid organization details
    And I submit the registration form
    Then a success alert should appear
    And workspace setup modal should appear
    When I verify the account via Mailinator
    Then Thank You page should be visible

  @Integration @Login
  Scenario: TC_07 - Successful Registration with verification & login
    When I fill valid organization details
    And I submit the registration form
    Then a success alert should appear
    And workspace setup modal should appear
    When I verify the account via Mailinator
    Then Thank You page should be visible
    When I fetch login credentials from Mailinator
    Then I should be able to login successfully
    Then All Steps Completed page should be visible