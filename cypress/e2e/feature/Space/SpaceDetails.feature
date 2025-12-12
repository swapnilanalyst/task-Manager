Feature: Space Details - Projects, Tasks, Members, Files, Activity and Settings
  As a user
  I want to view and manage a single space
  So that I can track all projects, tasks, members and configuration in one place

  Background:
    Given I am logged in and on the Spaces page
    And I have at least one existing space

  # # ==========================================================
  # #1) NAVIGATION TO SPACE DETAILS
  # #==========================================================

  # # --- from sidebar ---

  Scenario: Open space details from sidebar by space name
    When I open the space details for space "SalesCRM" from the sidebar
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"

  Scenario: Open space details from sidebar by index
    When I open the space details for space "1" from the sidebar
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"

  # --- from main card by name / index ---

  Scenario: Open space details from space card title by name
    When I open the space details for card "Space@123" from the grid
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"

  Scenario: Open space details from space card title by index
    When I open the space details for card "1" from the grid
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"

  # --- from open icon on card ---

  Scenario: Open space details using open icon from card by name
    When I open the space details using open icon for card "Space@123"
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"

  Scenario: Open space details using open icon from card by index
    When I open the space details using open icon for card "0"
    Then I should be on the space details page
    And the URL should contain "/dashboard/view-space"


  # ==========================================================
  # 2) BASIC HEADER & COMMON UI ON SPACE DETAILS
  # ==========================================================

  Scenario: Space header should show selected space name and description
    Given I am on the space details page for a selected space
    Then the space header should show the same space name that I opened
    And the space header should show the space description or default message

  Scenario: Space breadcrumb should show dashboard and spaces path
    Given I am on the space details page for a selected space
    Then I should see the breadcrumb "Dashboard > Spaces"

  Scenario: Space header should show owner name and label
    Given I am on the space details page for a selected space
    Then I should see the owner label on the header
    And I should see the owner name on the header

  Scenario: Create Project button should be visible on space details header
    Given I am on the space details page for a selected space
    Then I should see the Create Project button on space details

  Scenario: All tabs should be visible on space details page
    Given I am on the space details page for a selected space
    Then I should see the Projects tab
    And I should see the Tasks tab
    And I should see the Members tab
    And I should see the File tab
    And I should see the Activity tab
    And I should see the Setting tab

  Scenario: Projects tab should be selected by default
    Given I am on the space details page for a selected space
    Then the Projects tab should be selected by default

  Scenario: Each tab should show count next to its name
    Given I am on the space details page for a selected space
    Then the Projects tab should show a project count
    And the Tasks tab should show a task count
    And the Members tab should show a member count

  Scenario: Selected tab highlight should move when switching tabs
    Given I am on the space details page for a selected space
    When I switch to the Tasks tab
    Then the Tasks tab should be highlighted as selected
    When I am on the Members tab
    Then the Members tab should be highlighted as selected


  # ==========================================================
  # 3) PROJECTS TAB - BASIC VIEW & COUNTS
  # ==========================================================

  Scenario: Projects tab should show project cards list
    Given I am on the space details page for a selected space
    And I am on the Projects tab
    Then I should see the list of project cards for that space

  Scenario: Project card should show basic details    //Need Enhancement
    Given I am on the space details page for a selected space
    And I am on the Projects tab
    Then each project card should show project name
    And each project card should show project type or tag
    And each project card should show progress bar
    And each project card should show due date
    And each project card should show task count

  Scenario: Projects tab count should match number of project cards on first page
    Given I am on the space details page for a selected space
    And I am on the Projects tab
    Then the Projects tab count should be equal to the number of project cards on the page

  Scenario: Project cards pagination should work         
    Given I am on the space details page for a selected space
    And I am on the Projects tab
    When I go to the next page of project cards
    Then the project cards list should change
    And I should be able to go back to the previous page

  Scenario: Open project details from project card open icon      
    Given I am on the space details page for a selected space
    And I am on the Projects tab
    When I open any project details using open icon from the card
    Then I should be navigated to that project’s details page

  Scenario: Projects tab should show empty state when there are no projects    //With blank space
    Given I switch to "No Data" space
    Given I am on the space details page for a space with no projects
    And I am on the Projects tab
    Then I should see a message that there are no projects in this space


  # ==========================================================
  # 4) TASKS TAB - TABLE, COUNTS, FILTERS
  # ==========================================================

  Scenario: Tasks tab basic UI should be visible 
    Given I am on the space details page for a selected space
    When I switch to the Tasks tab
    Then I should see the search tasks input
    And I should see the status filter dropdown
    And I should see the More Filters button
    And I should see total task summary cards
    And I should see the tasks table

  Scenario: Task summary tiles should show all four counts 
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    Then I should see Total Tasks count
    And I should see In Progress count
    And I should see Completed count
    And I should see Overdue count

  Scenario: Task table header should show all columns   
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    Then I should see following columns in tasks table:
                    | Name       |
                    | Start Date |
                    | Due Date   |
                    | Status     |

  Scenario: Total Tasks count should match number of rows in the table
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    Then the Total Tasks count should be equal to the number of task rows on the page

  Scenario: Search tasks by name from the tasks search box         //search function not implemented
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    When I search for a task by name
    Then only tasks containing that name should be visible in the table

  Scenario: Filter tasks by status using status dropdown       //Filter feature not implemented
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    When I filter tasks by status "In Progress"
    Then only tasks with status "In Progress" should be visible in the table

  Scenario: More Filters panel should open on click           //Filter feature not implemented
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    When I click on More Filters
    Then I should see additional filter options for tasks

  Scenario: Task table pagination should work
    Given I am on the space details page for a selected space
    And there are multiple task pages in the space
    And I am on the Tasks tab
    When I go to the next page of the tasks table
    Then the task rows should change
    And I should be able to go back to the previous page

  Scenario: Tasks table rows per page control should work
    Given I am on the space details page for a selected space
    And I am on the Tasks tab
    When I change rows per page to "10"
    Then up to 10 task rows should be visible in the table

  Scenario: Tasks tab should show empty state when there are no tasks    //With Blank Space
    Given I switch to "No Data" space
    Given I am on the space details page for a space with no tasks
    And I am on the Tasks tab
    Then I should see a message that there are no tasks in this space


  # ==========================================================
  # 5) MEMBERS TAB - COUNTS & EMPTY STATE
  # ==========================================================

  Scenario: Members tab basic UI should be visible
    Given I am on the space details page for a selected space
    When I am on the Members tab
    Then I should see the Members tab content area

  Scenario: Members tab count should match number of members listed   //Need Enhancement
    Given I am on the space details page for a space with members
    And I am on the Members tab
    Then the Members tab count should be equal to the number of members shown

  Scenario: Members tab should show empty state when there are no members
    Given I switch to "No Data" space
    Given I am on the space details page for a space with no members
    And I am on the Members tab
    Then I should see a message that there are no members in this space


  # # ==========================================================
  # # 6) FILE TAB - BASIC VIEW & EMPTY STATE                      //File Feature not implemented
  # # ==========================================================

  # Scenario: File tab basic UI should be visible                  //File Feature not implemented
  #   Given I am on the space details page for a selected space
  #   When I switch to the File tab
  #   Then I should see the File tab content area

  # Scenario: File tab should show empty state when there are no files     //File Feature not implemented
  # Given I am on the space details page for a space with no files
  # When I switch to the File tab
  # Then I should see a message that there are no files in this space


  # # ==========================================================
  # # 7) ACTIVITY TAB - LOGS & EMPTY STATE                       //This feature not implemented
  # # ==========================================================

  # Scenario: Activity tab basic UI should be visible            //Activity Feature not implemented
  #   Given I am on the space details page for a selected space
  #   When I switch to the Activity tab
  #   Then I should see the Activity tab content area

  # Scenario: Activity tab should show activity logs when actions are done     //Activity Feature not implemented
  #   Given I am on the space details page for a selected space
  #   And I have performed some actions in this space
  #   And I switch to the Activity tab
  #   Then I should see at least one activity log entry

  # Scenario: Activity tab should show empty state when there are no logs      //Activity Feature not implemented
  # Given I switch to "No Data" space
  # Given I am on the space details page for a new space with no activity
  # And I switch to the Activity tab
  # Then I should see a message that there is no activity yet


  # # ==========================================================
  # # 8) SETTINGS TAB - BASIC CONFIG                              //This feature not implemented
  # # ==========================================================

  # Scenario: Settings tab basic UI should be visible              //Setting feature not implemented
  #   Given I am on the space details page for a selected space
  #   When I switch to the Setting tab
  #   Then I should see the Setting tab content area

  # Scenario: Settings tab should show editable space name field    //Setting feature not implemented
  #   Given I am on the space details page for a selected space
  #   And I am on the Setting tab
  #   Then I should see the space name input field

  # Scenario: Settings tab should show editable description field   //Setting feature not implemented
  #   Given I am on the space details page for a selected space
  #   And I am on the Setting tab
  #   Then I should see the space description input field

  # Scenario: Updating space name from settings should update header and sidebar
  #   Given I am on the space details page for a selected space
  #   And I am on the Setting tab
  #   When I update the space name from settings
  #   And I save the space settings
  #   Then the space header should show the updated space name
  #   And the space should show updated name in the spaces sidebar list

  # Scenario: Reloading the space details URL should keep the same space context
  #   Given I am on the space details page for a selected space
  #   When I reload the page
  #   Then the space header should still show the same space name
  #   And the Projects tab should remain selected by default

