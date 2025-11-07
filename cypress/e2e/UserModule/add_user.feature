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

  @multipleUserCreation
  Scenario: Add multiple users successfully
    When I click on the account button
    And I click on Add Users from the list
    And I create 3 new users

  @negative @BlankFields
  Scenario: Verify system blocks saving blank form
    When I click on the account button
    And I click on Add Users from the list
    And I click on the New User button
    And I submit the form without filling any details
    Then I should see validation errors for required fields

  @negative @invalidEmailFormatCheck
  Scenario: Verify invalid email format not accepted
    When I click on the account button
    And I click on Add Users from the list
    And I click on the New User button
    And I fill in user form with invalid email
    And I click on the submit button
    Then I should see an email format validation error

  @negative @duplicateEmailCheck
  Scenario: Verify duplicate email cannot be used
    When I click on the account button
    And I click on Add Users from the list
    And I create a new user and store its contact
    And I click on the New User button
    And I fill in user form with the existing email
    And I click on the submit button
    Then I should see a duplicate email error

  @negative @duplicatePhoneNumberCheck
  Scenario: Verify duplicate mobile number not accepted
    When I click on the account button
    And I click on Add Users from the list
    And I create a new user and store its contact
    And I click on the New User button
    And I fill in user form with the existing mobile number
    And I click on the submit button
    Then I should see a duplicate mobile number error
