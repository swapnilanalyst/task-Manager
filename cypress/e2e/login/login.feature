Feature: Login Functionality for Task Manager

  Background:
    Given I am on the login page

  @positive
  Scenario: Successful login with valid credentials
    When I enter valid email and password
    And I click on the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message

  @negative
  Scenario: Login with invalid password
    When I enter valid email and invalid password
    And I click on the login button
    Then I should see invalid email or password error

  @negative
  Scenario: Login with unregistered email
    When I enter unregistered email and valid password
    And I click on the login button
    Then I should see email not registered error

  @negative
  Scenario: Login with empty fields
    When I leave both fields empty
    And I click on the login button
    Then I should see required field validation message

  @negative
  Scenario: Login with only email field filled
    When I fill only the email field
    And I click on the login button
    Then I should see password required message

  @negative
  Scenario: Login with only password field filled
    When I fill only the password field
    And I click on the login button
    Then I should see email required message
