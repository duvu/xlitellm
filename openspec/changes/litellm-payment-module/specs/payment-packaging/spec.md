## ADDED Requirements

### Requirement: Python Package Structure
The system SHALL be structured as a standard Python package with src layout, installable via pip.

#### Scenario: Install from git
- **WHEN** running `pip install git+ssh://git@github.com/duvu/litellm-payment.git`
- **THEN** the package `litellm_payment` SHALL be installed with all dependencies

#### Scenario: Install from wheel
- **WHEN** a built wheel file is available
- **THEN** running `pip install litellm_payment-*.whl` SHALL install the package

### Requirement: Package Metadata
The system SHALL define proper package metadata in `pyproject.toml` including name, version, description, Python version requirement (>=3.9), and dependencies.

#### Scenario: Package metadata is valid
- **WHEN** `pip show litellm-payment` is run after installation
- **THEN** it SHALL display correct name, version, and dependencies

### Requirement: Docker Build Integration
The system SHALL provide instructions and Dockerfile fragments for integrating into a custom LiteLLM Docker build.

#### Scenario: Build custom LiteLLM image with payment module
- **WHEN** the payment module wheel is copied into the LiteLLM Docker build
- **THEN** adding `COPY litellm_payment*.whl /tmp/ && pip install /tmp/litellm_payment*.whl` to the Dockerfile SHALL result in a working image with payment features

#### Scenario: Docker Compose integration
- **WHEN** docker-compose.yml mounts payment config and sets environment variables
- **THEN** the payment module SHALL initialize with the provided configuration

### Requirement: Environment-based Configuration
The system SHALL support all configuration through environment variables, with no hardcoded secrets.

#### Scenario: All secrets via env vars
- **WHEN** the package is deployed
- **THEN** all API keys, webhook secrets, and database URLs SHALL be read from environment variables

#### Scenario: Missing required env var
- **WHEN** a required environment variable is not set
- **THEN** the system SHALL log a clear error message at startup indicating what is missing

### Requirement: Dependency Isolation
The system SHALL minimize dependencies and avoid conflicts with LiteLLM's existing dependencies.

#### Scenario: No dependency conflicts
- **WHEN** `litellm-payment` is installed alongside `litellm`
- **THEN** there SHALL be no pip dependency resolution conflicts

#### Scenario: Core dependencies
- **WHEN** the package is installed
- **THEN** it SHALL depend on: httpx, pydantic, sqlalchemy (for DB), alembic (for migrations), and litellm (as peer dependency)

### Requirement: Database Migrations
The system SHALL manage its own database migrations independently from LiteLLM's Prisma migrations using Alembic.

#### Scenario: Run migrations
- **WHEN** `litellm-payment migrate` CLI command is run
- **THEN** Alembic SHALL apply all pending migrations to create/update payment tables (prefixed with `payment_`)

#### Scenario: Migrations do not affect LiteLLM tables
- **WHEN** payment migrations run
- **THEN** no LiteLLM-owned tables SHALL be created, modified, or dropped
