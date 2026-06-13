## ADDED Requirements

### Requirement: Pre-call Balance Check
The system SHALL check user payment balance before allowing LLM API calls when balance enforcement is enabled.

#### Scenario: User has sufficient balance
- **WHEN** a user makes an LLM API call and their payment balance >= estimated cost
- **THEN** the request SHALL proceed normally

#### Scenario: User has insufficient balance
- **WHEN** a user makes an LLM API call and their payment balance < estimated cost
- **THEN** the system SHALL reject the request with HTTP 402 (Payment Required) and include balance and estimated cost in the error response

#### Scenario: Balance enforcement disabled
- **WHEN** balance enforcement is not enabled in config
- **THEN** all requests SHALL proceed regardless of payment balance

### Requirement: Post-call Balance Deduction
The system SHALL deduct actual usage cost from user payment balance after each successful LLM API call.

#### Scenario: Successful call deducts cost
- **WHEN** an LLM API call completes successfully
- **THEN** the system SHALL deduct the actual cost (from LiteLLM's cost calculation) from the user's payment balance

#### Scenario: Failed call does not deduct
- **WHEN** an LLM API call fails with a provider error
- **THEN** the system SHALL NOT deduct any cost from the user's payment balance

### Requirement: Callback Registration
The system SHALL register as a LiteLLM custom callback when the module is loaded, using LiteLLM's callback system (`litellm.callbacks`).

#### Scenario: Module auto-registers on import
- **WHEN** `litellm_payment` package is imported and LiteLLM proxy is running
- **THEN** the payment callback SHALL be registered in `litellm.callbacks` list

#### Scenario: Module not installed
- **WHEN** `litellm_payment` package is not installed
- **THEN** LiteLLM proxy SHALL function normally without payment features

### Requirement: Route Registration
The system SHALL add payment API routes to the LiteLLM FastAPI application when the module is loaded.

#### Scenario: Routes available when module loaded
- **WHEN** the payment module is loaded and proxy starts
- **THEN** all `/payment/*` endpoints SHALL be available in the OpenAPI schema

#### Scenario: Routes not available when module not loaded
- **WHEN** the payment module is not installed
- **THEN** no `/payment/*` endpoints SHALL exist

### Requirement: Configuration via LiteLLM Config
The system SHALL support configuration through LiteLLM's proxy config yaml or environment variables.

#### Scenario: Config via litellm_config.yaml
- **WHEN** the litellm config yaml contains a `payment` section with provider configs
- **THEN** the payment module SHALL read and apply those configurations

#### Scenario: Config via environment variables
- **WHEN** payment provider environment variables are set (e.g., SEPAY_API_KEY)
- **THEN** the payment module SHALL use those for provider configuration
