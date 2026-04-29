## ADDED Requirements

### Requirement: Root URL redirects to dashboard UI
The deployment SHALL redirect requests for the site root path (`/`) to the dashboard path (`/ui`).

#### Scenario: Browser request to root path
- **WHEN** a client sends `GET /`
- **THEN** the system MUST respond with an HTTP redirect whose `Location` header is `/ui`

#### Scenario: Request to dashboard path is not redirected back to root
- **WHEN** a client sends `GET /ui`
- **THEN** the system MUST NOT redirect the client to `/`
