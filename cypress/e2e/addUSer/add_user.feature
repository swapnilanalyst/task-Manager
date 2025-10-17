Feature: Add User Functionality for Task Manager

  Background:
    Given I am logged in and on the dashboard page

  @positive
  Scenario: Add a new user successfully
    When I click on the account button
    And I click on Add Users from the list
    And I click on the New User button
    And I fill in all user details
    And I click on the submit button
    Then I should see a success message for user creation
