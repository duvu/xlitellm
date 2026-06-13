## MODIFIED Requirements

### Requirement: Payment link appears in sidebar
The LiteLLM dashboard sidebar SHALL display a "Payment" menu item with a wallet icon on ALL pages, not just when navigating directly to `/payment`.

#### Scenario: Payment visible in sidebar for all logged-in users
- **WHEN** a logged-in user loads the LiteLLM UI at `/ui/` (which redirects to `/ui/virtual-keys`)
- **THEN** the sidebar SHALL contain a "Payment" menu item immediately
- **THEN** the layout JS bundle loaded by the page SHALL contain the Payment sidebar entry

#### Scenario: Payment sidebar link navigates to payment page
- **WHEN** a logged-in user clicks the "Payment" sidebar item
- **THEN** the browser SHALL navigate to `/ui/payment`
- **THEN** the response status SHALL be 200
- **THEN** the payment page (balance card + top-up button + history table) SHALL render

#### Scenario: Consistent sidebar across all pages
- **WHEN** a user navigates between any pages (virtual-keys, models, usage, payment, etc.)
- **THEN** the Payment sidebar item SHALL be visible on every page
- **THEN** all pages SHALL load the same layout JS bundle
