## ADDED Requirements

### Requirement: Payment link appears in sidebar
The LiteLLM dashboard sidebar SHALL display a "Payment" menu item with a wallet icon.

#### Scenario: Payment visible in sidebar for all logged-in users
- **WHEN** a logged-in user loads the LiteLLM UI at `/ui/`
- **THEN** the sidebar SHALL contain a "Payment" menu item

#### Scenario: Payment sidebar link navigates to payment page
- **WHEN** a logged-in user clicks the "Payment" sidebar item
- **THEN** the browser SHALL navigate to `/ui/payment`
- **THEN** the response status SHALL be 200
- **THEN** the payment page (balance card + top-up button + history table) SHALL render
