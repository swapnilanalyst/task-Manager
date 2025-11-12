@Reg
Feature: User list Functionality for Task Manager

  Background:
    Given I am logged in and on the dashboard page

  @positive @NewUserE2E @e2e
  Scenario: Load user list successfully
    When I click on the account button
    And I click on Add Users from the list
    When I wait for the user list to load
    Then I should see the user list table
    And I should see at least 1 user row

  @positive @NewUserE2E @e2e
  Scenario: Search users by keyword
    When I click on the account button
    And I click on Add Users from the list
    And I search the user list for "Brenda"
    Then each visible user row should include "Brenda" in name or email

  @positive
  Scenario: Change rows per page
    When I click on the account button
    And I click on Add Users from the list
    And I set rows per page to 5
    Then I should see at most 5 rows

  @positive @NewUserE2E @e2e
  Scenario: Switch list tabs
    When I click on the account button
    And I click on Add Users from the list
    And I open the "Active" tab
    Then I should see the user list table
    And I open the "InActive" tab
    Then I should see the user list table
