## ADDED Requirements

### Requirement: Payment page accessible at /ui/payment
The LiteLLM proxy UI SHALL serve the payment dashboard page at the extensionless path `/ui/payment` returning HTTP 200.

#### Scenario: Extensionless route returns 200
- **WHEN** an HTTP GET request is made to `http://<host>:5003/ui/payment`
- **THEN** the response status code SHALL be 200
- **THEN** the response content-type SHALL be `text/html`

#### Scenario: Payment HTML file pre-structured in Docker image
- **WHEN** the Docker image is built
- **THEN** the file `/usr/lib/python3.13/site-packages/litellm/proxy/_experimental/out/payment/index.html` SHALL exist inside the image

#### Scenario: Payment sidebar link navigates to page
- **WHEN** a logged-in user clicks the "Payment" menu item in the sidebar
- **THEN** the browser SHALL navigate to `/ui/payment` without a 404 error
- **THEN** the Payment page (balance card + top-up modal + history table) SHALL render
