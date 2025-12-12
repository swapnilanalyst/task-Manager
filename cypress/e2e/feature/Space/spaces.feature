Feature: Spaces - View, Create and Manage Spaces
  As a user
  I want to manage spaces
  So that I can organise projects and members properly

  Background:
    Given I am logged in and on the Spaces page

  # ==========================================================
  # 1) BASIC UI
  # ==========================================================

  Scenario: Verify Spaces page basic layout
    Then I should see the Spaces page title
    And I should see the Create Space button
    And I should see the search spaces input
    And I should see the sort by dropdown
    And I should see the left sidebar space list
    And I should see at least one space card on the grid

  Scenario: Verify Create Space modal basic UI
    When I open the Create Space modal
    Then I should see title field on create space modal
    And I should see description field on create space modal
    And I should see members dropdown on create space modal
    And I should see Cancel button on create space modal
    And I should see Save button on create space modal


  # ==========================================================
  # 2) CREATE SPACE – POSITIVE & NEGATIVE FLOWS
  # ==========================================================

  Scenario: Save button should be disabled when title is empty
    When I open the Create Space modal
    Then the Save Space button should be disabled

  Scenario: Create space with title only
    When I open the Create Space modal
    And I enter a unique space title
    And I save the space
    Then I should see a success message for space creation
    And the created space card should be visible in the grid
    And the created space should be visible in the left sidebar list

  Scenario: Create space with title and description only
    When I open the Create Space modal
    And I enter a unique space title
    And I enter a description for the space
    And I save the space
    Then I should see a success message for space creation
    And the created space card should show the same title and description

  Scenario: Create space with title and members only
    When I open the Create Space modal
    And I enter a unique space title
    And I select one member from the members dropdown
    And I save the space
    Then I should see a success message for space creation
    And the created space card should show the same title
    And the created space card should show correct member count

  Scenario: Create space with title, description and members
    When I open the Create Space modal
    And I enter a unique space title
    And I enter a description for the space
    And I select one member from the members dropdown
    And I save the space
    Then I should see a success message for space creation
    And the created space card should show the same title and description
    And the created space card should show correct member count
    And the created space card should show the owner name

  Scenario: Do not allow saving space when title is empty but other fields are filled
    When I open the Create Space modal
    And I enter a description for the space
    And I select one member from the members dropdown
    Then the Save Space button should be disabled

  Scenario: Validate title character limit
    When I open the Create Space modal
    And I enter a title longer than allowed characters
    Then the title field should not accept more characters
    And the title length should be within the allowed limit

  Scenario: Validate description character limit
    When I open the Create Space modal
    And I enter a description longer than allowed characters
    Then the description field should not accept more characters
    And the description length should be within the allowed limit

  Scenario: Members dropdown should not show already selected members
    When I open the Create Space modal
    And I select multiple members from the members dropdown
    Then the selected members should not appear again in the dropdown list

  Scenario: Cancel create space should not create new card
    When I open the Create Space modal
    And I enter a unique space title
    And I enter a description for the space
    And I select one member from the members dropdown
    And I click on Cancel in the Create Space modal
    Then the Create Space modal should be closed
    And the cancelled space should not be visible in the space cards list
    And the cancelled space should not be visible in the left sidebar list

  Scenario: Do not allow duplicate space title
    Given I already have a space with a specific title
    When I open the Create Space modal
    And I enter the same existing space title
    And I save the space
    Then I should see a duplicate space validation message
    And a new space card should not be created for the duplicate title


  # ==========================================================
  # 3) VIEW / BROWSE SPACES – GRID, SIDEBAR, SEARCH, SORT, OPEN
  # ==========================================================

  Scenario: Created space card should be visible in grid with all details
    Given I have a space created with title, description and members
    Then the created space card should be visible in the grid
    And the created space card should show the same title and description
    And the created space card should show correct member count
    And the created space card should show projects and tasks count

  Scenario: Created space should be visible in sidebar list
    Given I have a space created with title, description and members
    Then the created space should be visible in the left sidebar list

  Scenario: Search spaces by title from search box
    Given I have a space created with a unique title
    When I search space by that title from the search box
    Then only spaces matching that title should be visible in the grid

  Scenario: Sort spaces by Latest
    Given I have more than one space present
    When I sort spaces by "Latest"
    Then the most recently created space should appear first in the grid

  Scenario: Sort spaces by Oldest
    Given I have more than one space present
    When I sort spaces by "Oldest"
    Then the oldest created space should appear first in the grid

  Scenario: Sort spaces alphabetically A to Z
    Given I have spaces with different titles
    When I sort spaces by "Alphabetical"
    Then the space cards in the grid should be ordered alphabetically by title

  Scenario: Space card should show owner avatar and name
    Given I have a space created with title, description and members
    Then the space card should show owner avatar
    And the space card should show owner name

  Scenario: Open space details page using card redirect button
    Given I have a space created with title, description and members
    When I click on the open space button on that card
    Then I should be navigated to that space details page
    And the space details page header should show the same space title 


  # ==========================================================
  # 4) CARD MENU – EDIT & DELETE
  # ==========================================================

  Scenario: Space card menu should show Edit and Delete options
    Given I have a space created with title, description and members
    When I open the space card menu for that space
    Then I should see Edit option for the space
    And I should see Delete option for the space

  Scenario: Delete space from card menu
    Given I have a space created with title, description and members
    When I delete that space from the card menu
    And I confirm the deletion in the confirmation dialog
    Then I should see a success message for space deletion
    And that space card should no longer be visible in the grid
    And that space should no longer be visible in the left sidebar list


  # ==========================================================
  # 5) EDIT SPACE – TITLE, DESCRIPTION, MEMBERS, CANCEL
  # ==========================================================

  Scenario: Open Edit Space modal from card menu
    Given I have a space created with title, description and members
    When I open the Edit Space modal for that space
    Then the Edit Space modal should be visible
    And the title field should be pre-filled with existing title
    And the description field should be pre-filled with existing description

  Scenario: Edit only space title
    Given I have a space created with title, description and members
    When I open the Edit Space modal for that space
    And I update the space title
    And I save the edited space
    Then I should see a success message for space update
    And the space card should show the updated title
    And the left sidebar should show the updated space title

  Scenario: Edit only space description
    Given I have a space created with title, description and members
    When I open the Edit Space modal for that space
    And I update the space description
    And I save the edited space
    Then I should see a success message for space update
    And the space card should show the updated description

  # Scenario: Edit members list of a space                //Not Implemented yet
  #   Given I have a space created with title, description and members
  #   When I open the Edit Space modal for that space
  #   And I update the members selection from the dropdown
  #   And I save the edited space
  #   Then the space card should show the updated member count

  Scenario: Cancel editing space should not update card
    Given I have a space created with title, description and members
    When I open the Edit Space modal for that space
    And I update the space title
    And I click on Cancel in the Edit Space modal
    Then the Edit Space modal should be closed
    And the space card should still show the old space title
