Feature: Team Management Details Module
  As a user
  I want to manage team details
  So that I can organize team members properly

  Background:
    Given I am logged in and on the Team Management page

  # # ----------------- BASIC NAVIGATION -----------------
  # Scenario: Open any team details page from the team list
  #   When I click on team "Bt Team"
  #   Then I should be navigated to that team's details page
  #   And I should see the team name on the details page header
  #   And I should see the list of team members

  # # ----------------- BASIC UI ON DETAILS PAGE -----------------
  # Scenario: Verify controls on the team details page
  #   When I click on team "Bt Team"
  #   Then I should see the Select All checkbox
  #   And I should see the top Remove User From Team button
  #   And I should see the Add Members in team button
  #   And I should see the list of team members

  # # ----------------- SELECT & REMOVE SINGLE MEMBER -----------------
  # Scenario: Select a single member and remove from team
  #   When I click on team "Bt Team"
  #   And I select one member card from the list
  #   Then the top Remove User From Team button should be enabled
  #   When I click on the top Remove User From Team button
  #   Then that member should be removed from the team list

  # # ----------------- SELECT ALL MEMBERS -----------------
  # Scenario: Select all members using Select All checkbox
  #   When I click on team "Ct Team"
  #   And I click on the Select All checkbox
  #   Then all member cards should be selected
  #   And the top Remove User From Team button should be enabled

  # # ----------------- REMOVE MEMBER FROM CARD BUTTON -----------------
  # Scenario: Remove a member using card Remove button
  #   When I click on team "Ct Team"
  #   And I note any member name from the list
  #   And I click on Remove User From Team button on that member card
  #   And I confirm member removal
  #   Then that member should not be visible in the team list anymore

  # ----------------- ADD MEMBER TO TEAM -----------------
  Scenario: Add a member to the team from Add Members popup
    When I click on team "Ct Team"
    And I click on the Add Members in team button
    And I select any member from the Add Members popup
    And I confirm adding member to the team
    Then I should see a success message for adding member
    And the added member should be visible in the team members list

  # # ----------------- PRINT / LOG MEMBER LIST -----------------
  # Scenario: Print all team members in console for debugging
  #   When I click on team "Ct Team"
  #   And I print all team members from the details page
  #   Then I should see at least one member in the printed list
