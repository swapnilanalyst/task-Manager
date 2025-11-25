Feature: Team Management Module
  As a user
  I want to manage teams
  So that I can organize members properly

  Background:
    Given I am logged in and on the Team Management page

    # ----------------- BASIC UI -----------------
  Scenario: Verify Team Management page loads correctly
      Then I should see the Team Management page title
      And I should see the Teams tab
      And I should see the Create Team button
      And I should see the Invite Member button


  # ----------------- CREATE TEAM -----------------
  Scenario: Create a new team successfully
    When I click on the Create Team button
    And I enter a unique team name
    And I submit the team form
    Then I should see a success message for team creation

  Scenario: Try creating a team with blank name
    When I click on the Create Team button
    And I submit the empty team form


  Scenario: Try creating a duplicate team
    Given a team already exists
    When I click on the Create Team button
    And I enter the same team name again
    And I submit the team form
    Then I should see a duplicate team error

  # ----------------- DELETE TEAM -----------------
  Scenario: Delete an existing team
    Given a team already exists
    When I delete that team
    Then the team should no longer appear in the list

  # ----------------- SEARCH -----------------
  Scenario: Search teams by name
    When I search for "Sales"
    Then all visible teams should contain "Sales"

  # ----------------- MEMBERS -----------------
  Scenario: Add a member to a team
   When  I search for "BT Team"
    And each visible teams row should include "Bt Team" in list
    And I click the add member button
    And I select member "Kranti" from the member list
    And I open the stored team from the list
    Then I should see that member added to the team

# ----------------- ROWS PER PAGE -----------------
Scenario: Change rows per page
  When I set team rows per page to 10
  Then I should see at most 10 team rows

# ----------------- TAB SWITCHING -----------------
Scenario: Switch to All Members tab
  When  Go to the "All Members" tab
  Then I should see the all members list

Scenario: Switch to Roles & Permissions tab
  When I open the "Roles & Permissions" tab
  Then I should see the roles section
