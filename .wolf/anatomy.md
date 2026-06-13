# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-24T05:19:16.282Z
> Files: 654 tracked | Anatomy hits: 0 | Misses: 0

## ../../../../tmp/litellm-payment-v11/

- `Dockerfile` — Docker container definition (~85 tok)

## ../../../../tmp/litellm-payment-v12/

- `Dockerfile` — Docker container definition (~74 tok)

## ../../../../tmp/litellm-payment-v13/

- `Dockerfile` — Docker container definition (~85 tok)

## ../../../../tmp/litellm-payment-v3/

- `Dockerfile` — Docker container definition (~175 tok)

## ../../../../tmp/litellm-payment-v5/

- `Dockerfile` — Docker container definition (~74 tok)

## ../../../../tmp/litellm-payment-v6/

- `Dockerfile` — Docker container definition (~74 tok)

## ../../../../tmp/litellm-payment-v8/

- `Dockerfile` — Docker container definition (~134 tok)

## ../../deployment/server2/

- `docker-compose.yml` — Docker Compose services (~2024 tok)

## ../../deployment/server2/litellm/

- `default.env` (~491 tok)

## ../litellm-payment/

- `.gitignore` — Git ignore rules (~151 tok)
- `alembic.ini` — Alembic configuration for litellm-payment (~158 tok)
- `docker-compose.yml` — Docker Compose services (~477 tok)
- `Dockerfile` — Docker container definition (~146 tok)
- `litellm_config.yaml` — Example litellm_config.yaml with payment module (~127 tok)
- `pyproject.toml` — Payment module for LiteLLM proxy - SePay & PayOS integration (~241 tok)
- `README.md` — Project documentation (~1019 tok)

## ../litellm-payment/src/litellm_payment/

- `__init__.py` — LiteLLM Payment Module - SePay & PayOS integration for LiteLLM proxy. (~192 tok)
- `_version.py` (~7 tok)
- `balance.py` — Balance management service for payment module. (~734 tok)
- `cli.py` — CLI entry point for litellm-payment module. (~703 tok)
- `config.py` — Configuration management for litellm-payment module. (~1013 tok)
- `db.py` — Database models and session management for payment module. (~1055 tok)
- `idempotency.py` — Idempotency logic for webhook processing. (~409 tok)
- `integration.py` — LiteLLM CustomLogger integration for payment balance checks and cost deduction. (~1846 tok)
- `models.py` — Pydantic models for payment operations. (~540 tok)
- `proxy_integration.py` — Auto-registration of payment module with LiteLLM proxy. (~1873 tok)
- `reconciliation.py` — Reconciliation job for SePay - polls provider API to catch missed webhooks. (~1106 tok)

## ../litellm-payment/src/litellm_payment/api/

- `__init__.py` — Payment API package. (~8 tok)
- `router.py` — FastAPI router for payment endpoints. (~3794 tok)

## ../litellm-payment/src/litellm_payment/migrations/

- `__init__.py` — Alembic migrations package. (~10 tok)
- `env.py` — Alembic environment configuration for litellm-payment migrations. (~464 tok)
- `script.py.mako` (~170 tok)

## ../litellm-payment/src/litellm_payment/migrations/versions/

- `001_initial_tables.py` — Initial payment tables (~586 tok)

## ../litellm-payment/src/litellm_payment/providers/

- `__init__.py` — Payment providers package. (~10 tok)
- `base.py` — Abstract payment provider interface. (~407 tok)
- `payos.py` — PayOS payment provider implementation. (~1690 tok)
- `registry.py` — Payment provider registry - discover and manage providers. (~519 tok)
- `sepay.py` — SePay payment provider implementation. (~1564 tok)

## ../litellm-payment/tests/

- `__init__.py` (~0 tok)
- `test_abstraction.py` — Unit tests for payment gateway abstraction layer. (~1590 tok)
- `test_api.py` — Unit tests for payment API endpoints using FastAPI TestClient. (~3097 tok)
- `test_integration.py` — Integration tests for PaymentCallbackHandler with LiteLLM CustomLogger. (~2736 tok)
- `test_payos.py` — Unit tests for PayOS provider with mocked API responses. (~1714 tok)
- `test_sepay.py` — Unit tests for SePay provider with mocked API responses. (~1569 tok)

## ./

- `.dockerignore` — Docker ignore rules (~287 tok)
- `.flake8` (~394 tok)
- `.git-blame-ignore-revs` — Add the commit hash of any commit you want to ignore in `git blame` here. (~103 tok)
- `.gitattributes` — Git attributes (~7 tok)
- `.gitignore` — Git ignore rules (~723 tok)
- `.pre-commit-config.yaml` (~374 tok)
- `AGENTS.md` — INSTRUCTIONS FOR LITELLM (~1511 tok)
- `batch_small.jsonl` (~145 tok)
- `build-docker.sh` (~738 tok)
- `CLAUDE.md` — OpenWolf (~1137 tok)
- `codecov.yaml` (~226 tok)
- `CONTRIBUTING.md` — Contributing to LiteLLM (~1971 tok)
- `docker-compose.hardened.yml` — Docker Compose: 2 services (~406 tok)
- `docker-compose.yml` — Docker Compose services (~676 tok)
- `Dockerfile` — Docker container definition (~656 tok)
- `Dockerfile.x51` — Dockerfile.x51 - Custom LiteLLM build with litellm-payment integration (~220 tok)
- `document.txt` — Declares for (~144 tok)
- `GEMINI.md` — GEMINI.md (~1075 tok)
- `index.yaml` (~1058 tok)
- `LICENSE` — Project license (~379 tok)
- `litellm.code-workspace` (~27 tok)
- `Makefile` — Make build targets (~1078 tok)
- `mcp_servers.json` (~216 tok)
- `package-lock.json` — npm lock file (~55206 tok)
- `package.json` — Node.js package manifest (~103 tok)
- `prometheus.yml` (~50 tok)
- `provider_endpoints_support.json` (~17369 tok)
- `proxy_server_config.yaml` (~2399 tok)
- `pyproject.toml` — Python project configuration (~1432 tok)
- `pyrightconfig.json` (~59 tok)
- `README.md` — Project documentation (~6111 tok)
- `render.yaml` (~74 tok)
- `requirements.txt` — Python dependencies (~783 tok)
- `review-results.md` — Review Results (~126 tok)
- `ruff.toml` (~170 tok)
- `schema.prisma` — Prisma database schema (~7516 tok)
- `security.md` — Data Privacy and Security (~468 tok)

## .circleci/

- `config.yml` (~41249 tok)
- `requirements.txt` — Python dependencies (~108 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/commands/opsx/

- `apply.md` — Implementing: <change-name> (schema: <schema-name>) (~1146 tok)
- `archive.md` — Archive Complete (~1254 tok)
- `explore.md` — The Stance (~1586 tok)
- `propose.md` (~1104 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## .claude/skills/openspec-apply-change/

- `SKILL.md` — Implementing: <change-name> (schema: <schema-name>) (~1190 tok)

## .claude/skills/openspec-archive-change/

- `SKILL.md` — Archive Complete (~1039 tok)

## .claude/skills/openspec-explore/

- `SKILL.md` — The Stance (~2309 tok)

## .claude/skills/openspec-propose/

- `SKILL.md` (~1161 tok)

## .codex/skills/openspec-apply-change/

- `SKILL.md` — Implementing: <change-name> (schema: <schema-name>) (~1190 tok)

## .codex/skills/openspec-archive-change/

- `SKILL.md` — Archive Complete (~1039 tok)

## .codex/skills/openspec-explore/

- `SKILL.md` — The Stance (~2309 tok)

## .codex/skills/openspec-propose/

- `SKILL.md` (~1161 tok)

## .devcontainer/

- `devcontainer.json` (~456 tok)
- `post-create.sh` (~130 tok)

## .github/

- `dependabot.yaml` (~53 tok)
- `FUNDING.yml` — These are supported funding model platforms (~221 tok)
- `pull_request_template.md` — Relevant issues (~298 tok)
- `template.yaml` (~779 tok)

## .github/ISSUE_TEMPLATE/

- `bug_report.yml` (~428 tok)
- `config.yml` (~111 tok)
- `feature_request.yml` (~530 tok)

## .github/actions/helm-oci-chart-releaser/

- `action.yml` (~672 tok)

## .github/prompts/

- `opsx-apply.prompt.md` — Implementing: <change-name> (schema: <schema-name>) (~1126 tok)
- `opsx-archive.prompt.md` — Archive Complete (~1233 tok)
- `opsx-explore.prompt.md` — The Stance (~1563 tok)
- `opsx-propose.prompt.md` (~1084 tok)

## .github/scripts/

- `scan_keywords.py` — read_event_payload, get_issue_text, detect_keywords, send_webhook + 1 more (~1166 tok)

## .github/skills/openspec-apply-change/

- `SKILL.md` — Implementing: <change-name> (schema: <schema-name>) (~1190 tok)

## .github/skills/openspec-archive-change/

- `SKILL.md` — Archive Complete (~1039 tok)

## .github/skills/openspec-explore/

- `SKILL.md` — The Stance (~2309 tok)

## .github/skills/openspec-propose/

- `SKILL.md` (~1161 tok)

## .github/workflows/

- `auto_update_price_and_context_window_file.py` — Asynchronously fetch data from a given URL (~1800 tok)
- `auto_update_price_and_context_window.yml` — CI: Updates model_prices_and_context_window.json and Create Pull Request (~300 tok)
- `create_daily_staging_branch.yml` — CI: Create Daily Staging Branch (~391 tok)
- `ghcr_deploy.yml` — this workflow is triggered by an API call when there is a new PyPI release of LiteLLM (~5747 tok)
- `ghcr_helm_deploy.yml` — this workflow is triggered by an API call when there is a new PyPI release of LiteLLM (~765 tok)
- `helm_unit_test.yml` — CI: Helm unit test (~162 tok)
- `interpret_load_test.py` — Test file (~1384 tok)
- `issue-keyword-labeler.yml` — CI: Issue Keyword Labeler (~558 tok)
- `label-component.yml` — CI: Label Component Issues (~1365 tok)
- `llm-translation-testing.yml` — CI: LLM Translation Tests (~834 tok)
- `load_test.yml` — CI: Test Locust Load Test (~521 tok)
- `locustfile.py` — MyUser: chat_completion (~266 tok)
- `main.yml` — CI: Publish Dev Release to PyPI (~285 tok)
- `publish-migrations.yml` — CI: Publish Prisma Migrations (~2235 tok)
- `read_pyproject_version.yml` — CI: Read Version from pyproject.toml (~237 tok)
- `README.md` — Project documentation (~253 tok)
- `redeploy_proxy.py` (~116 tok)
- `reset_stable.yml` — CI: Reset litellm_stable branch (~413 tok)
- `results_stats.csv` (~370 tok)
- `run_llm_translation_tests.py` — Colors: print_colored, get_provider_from_test_file, format_duration, generate_markdown_report (~5233 tok)
- `simple_pypi_publish.yml` — CI: Simple PyPI Publish (~505 tok)
- `stale.yml` — CI: "Stale Issue Management" (~232 tok)
- `test-linting.yml` — CI: LiteLLM Linting (~524 tok)
- `test-litellm.yml` — CI: LiteLLM Mock Tests (folder - tests/test_litellm) (~390 tok)
- `test-mcp.yml` — CI: LiteLLM MCP Tests (folder - tests/mcp_tests) (~411 tok)
- `update_release.py` — GitHub API endpoints (~450 tok)

## ci_cd/

- `baseline_db.py` — create_baseline (~526 tok)
- `check_file_length.py` — check_file_length (~211 tok)
- `check_files_match.py` — main, copy_content (~233 tok)
- `publish-proxy-extras.sh` — Exit on error (~103 tok)
- `run_migration.py` — create_migration (~990 tok)
- `security_scans_readme.md` — Security Scans (~84 tok)
- `security_scans.sh` — Security Scans Script for LiteLLM (~2760 tok)

## cookbook/

- `Benchmarking_LLMs_by_use_case.ipynb` (~146303 tok)
- `Claude_(Anthropic)_with_Streaming_liteLLM_Examples.ipynb` (~3456 tok)
- `Evaluating_LLMs.ipynb` — quickchart: displayQuickchartButton (~26508 tok)
- `google_adk_litellm_tutorial.ipynb` (~3423 tok)
- `liteLLM_A121_Jurrasic_example.ipynb` (~1812 tok)
- `LiteLLM_Azure_and_OpenAI_example.ipynb` — Declares to (~3219 tok)
- `liteLLM_Baseten.ipynb` (~907 tok)
- `LiteLLM_batch_completion.ipynb` (~1062 tok)
- `LiteLLM_Bedrock.ipynb` (~2486 tok)
- `liteLLM_clarifai_Demo.ipynb` (~2570 tok)
- `LiteLLM_CometAPI.ipynb` — Declares that (~20073 tok)
- `LiteLLM_Comparing_LLMs.ipynb` — table: appendQuickchartButton (~6941 tok)
- `LiteLLM_Completion_Cost.ipynb` (~2010 tok)
- `liteLLM_function_calling.ipynb` — Declares calling (~2180 tok)
- `liteLLM_Getting_Started.ipynb` (~3682 tok)
- `LiteLLM_HuggingFace.ipynb` (~2028 tok)
- `liteLLM_IBM_Watsonx.ipynb` — Declares as (~7058 tok)
- `liteLLM_Langchain_Demo.ipynb` (~1696 tok)
- `litellm_model_fallback.ipynb` (~282 tok)
- `LiteLLM_NovitaAI_Cookbook.ipynb` (~579 tok)
- `liteLLM_Ollama.ipynb` (~3045 tok)
- `LiteLLM_OpenRouter.ipynb` — Declares in (~1432 tok)
- `LiteLLM_Petals.ipynb` (~5392 tok)
- `LiteLLM_PromptLayer.ipynb` (~171046 tok)
- `liteLLM_Replicate_Demo.ipynb` (~2781 tok)
- `liteLLM_Streaming_Demo.ipynb` (~2078 tok)
- `litellm_test_multiple_llm_demo.ipynb` (~380 tok)
- `litellm_Test_Multiple_Providers.ipynb` — quickchart: displayQuickchartButton (~26432 tok)
- `LiteLLM_User_Based_Rate_Limits.ipynb` (~2096 tok)
- `liteLLM_VertextAI_Example.ipynb` (~1770 tok)
- `Migrating_to_LiteLLM_Proxy_from_OpenAI_Azure_OpenAI.ipynb` — model: main (~4589 tok)
- `mlflow_langchain_tracing_litellm_proxy.ipynb` (~2234 tok)
- `Parallel_function_calling.ipynb` — Declares calling (~5294 tok)
- `Proxy_Batch_Users.ipynb` — Declares HTTPHandler (~1667 tok)
- `result.html` — R: C, H, we + 56 more (~14689 tok)
- `TogetherAI_liteLLM.ipynb` (~18733 tok)
- `Using_Nemo_Guardrails_with_LiteLLM_Server.ipynb` (~1143 tok)
- `veo_video_generation.py` — VeoVideoGenerator: generate_video, wait_for_completion, download_video, generate_and_download + 1 more (~3341 tok)
- `VLLM_Model_Testing.ipynb` — buttonEl: convertToInteractive (~3634 tok)

## cookbook/benchmark/

- `benchmark.py` — Define the list of models to benchmark (~837 tok)
- `readme.md` — Setup: (~2545 tok)

## cookbook/benchmark/eval_suites_mlflow_autoevals/

- `auto_evals.py` (~190 tok)

## cookbook/codellama-server/

- `main.py` — API router (~912 tok)
- `README.MD` — CodeLlama Server: Streaming, Caching, Model Fallbacks (OpenAI + Anthropic), Prompt-tracking (~1339 tok)

## cookbook/community-resources/

- `get_hf_models.py` — get_next_url, get_models, get_cleaned_models, write_to_txt (~701 tok)
- `max_tokens.json` (~782 tok)

## cookbook/litellm-ollama-docker-image/

- `Dockerfile` — Docker container definition (~148 tok)
- `requirements.txt` — Python dependencies (~4 tok)
- `start.sh` (~7 tok)
- `test.py` (~221 tok)

## cookbook/litellm_proxy_server/

- `braintrust_prompt_wrapper_README.md` — Braintrust Prompt Wrapper for LiteLLM (~1599 tok)
- `braintrust_prompt_wrapper_server.py` — API: GET (3 endpoints) (~2381 tok)
- `cli_token_usage.py` — main (~508 tok)
- `readme.md` — liteLLM Proxy Server: 50+ LLM Models, Error Handling, Caching (~1591 tok)

## cookbook/litellm_proxy_server/batch_api/bedrock/

- `bedrock_batch_completions.jsonl` (~9916 tok)
- `bedrock.py` (~178 tok)

## cookbook/litellm_proxy_server/grafana_dashboard/

- `readme.md` — Contains LiteLLM maintained grafana dashboard (~158 tok)

## cookbook/litellm_proxy_server/grafana_dashboard/dashboard_1/

- `grafana_dashboard.json` (~4516 tok)
- `readme.md` — This folder contains the `json` for creating the following Grafana Dashboard (~74 tok)

## cookbook/litellm_proxy_server/grafana_dashboard/dashboard_v2/

- `grafana_dashboard.json` (~6488 tok)

## cookbook/litellm_proxy_server/mcp/

- `mcp_with_litellm_proxy.py` (~261 tok)

## cookbook/litellm_proxy_server/secret_manager/

- `custom_secret_manager_config.yaml` (~184 tok)
- `my_secret_manager.py` — InMemorySecretManager: async_read_secret, sync_read_secret, async_write_secret, async_delete_secret (~796 tok)

## cookbook/litellm_router/

- `error_log.txt` (~9493 tok)
- `load_test_proxy.py` — URL patterns: 1 routes (~1290 tok)
- `load_test_queuing.py` — URL patterns: 1 routes (~1524 tok)
- `load_test_router.py` — URL patterns: 1 routes (~1226 tok)
- `request_log.txt` (~599 tok)
- `response_log.txt` (~0 tok)

## cookbook/litellm_router/test_questions/

- `question1.txt` (~423 tok)
- `question2.txt` (~716 tok)
- `question3.txt` (~345 tok)

## cookbook/litellm_router_load_test/

- `test_loadtest_openai_client.py` — URL patterns: 1 routes (~622 tok)
- `test_loadtest_router_withs3_cache.py` — URL patterns: 1 routes (~818 tok)
- `test_loadtest_router.py` — URL patterns: 1 routes (~769 tok)

## cookbook/litellm_router_load_test/memory_usage/

- `router_endpoint.py` — API: GET, POST (2 endpoints) (~485 tok)
- `router_memory_usage copy.py` — ### What this tests #### (~714 tok)
- `router_memory_usage.py` — ### What this tests #### (~714 tok)
- `send_request.py` — Replace the URL with your actual endpoint (~262 tok)

## cookbook/logging_observability/

- `LiteLLM_Arize.ipynb` (~2911 tok)
- `LiteLLM_Langfuse.ipynb` (~1431 tok)
- `LiteLLM_Lunary.ipynb` (~4459 tok)
- `LiteLLM_Proxy_Langfuse.ipynb` (~3507 tok)

## cookbook/misc/

- `add_new_models.py` — get_initial_config, get_user_input, make_request, main (~643 tok)
- `config.yaml` (~770 tok)
- `dev_release.txt` (~81 tok)
- `migrate_proxy_config.py` — migrate_models (~978 tok)
- `openai_timeouts.py` — create_chat_completion (~234 tok)
- `RELEASE_NOTES_GENERATION_INSTRUCTIONS.md` — LiteLLM Release Notes Generation Instructions (~4465 tok)
- `sagmaker_streaming.py` — Notes - on how to do sagemaker streaming using boto3 (~419 tok)
- `test_responses_api.py` — Test file (~365 tok)
- `update_json_caching.py` — List of models to update (~499 tok)

## cookbook/mock_guardrail_server/

- `mock_bedrock_guardrail_server.py` — API: GET (2 endpoints) (~4721 tok)

## db_scripts/

- `create_views.py` — check_view_exists (~1842 tok)
- `migrate_keys.py` — # VARIABLES (~2177 tok)
- `update_unassigned_teams.py` — apply_db_fixes (~295 tok)

## deploy/

- `Dockerfile.ghcr_base` — Use the provided base image (~131 tok)

## deploy/azure_resource_manager/

- `main.bicep` (~243 tok)

## deploy/azure_resource_manager/azure_marketplace/

- `createUiDefinition.json` (~115 tok)
- `mainTemplate.json` (~490 tok)

## deploy/charts/litellm-helm/

- `.helmignore` — Patterns to ignore when building packages. (~94 tok)
- `Chart.yaml` (~450 tok)
- `README.md` — Project documentation (~4766 tok)
- `values.yaml` — Default values for litellm. (~2444 tok)

## deploy/charts/litellm-helm/charts/

- `postgresql-14.3.1.tgz` (~18443 tok)
- `redis-18.19.1.tgz` (~22174 tok)

## deploy/charts/litellm-helm/ci/

- `test-values.yaml` (~90 tok)

## deploy/charts/litellm-helm/templates/

- `_helpers.tpl` (~657 tok)
- `configmap-litellm.yaml` — K8s ConfigMap: {{ (~61 tok)
- `deployment.yaml` — K8s Deployment: {{ (~2409 tok)
- `extra-resources.yaml` (~35 tok)
- `hpa.yaml` — K8s HorizontalPodAutoscaler: {{ (~284 tok)
- `ingress.yaml` — K8s Ingress: {{ (~619 tok)
- `migrations-job.yaml` — K8s Job: {{ (~1230 tok)
- `NOTES.txt` (~461 tok)
- `poddisruptionbudget.yaml` — K8s PodDisruptionBudget: {{ (~300 tok)
- `secret-dbcredentials.yaml` — K8s Secret: {{ (~135 tok)
- `secret-masterkey.yaml` — K8s Secret: {{ (~82 tok)
- `service.yaml` — K8s Service: {{ (~180 tok)
- `serviceaccount.yaml` — K8s ServiceAccount: {{ (~112 tok)
- `servicemonitor.yaml` — K8s ServiceMonitor: {{ (~291 tok)

## deploy/charts/litellm-helm/templates/tests/

- `test-connection.yaml` — K8s Pod: "{{ (~205 tok)
- `test-env-vars.yaml` — K8s Pod: "{{ (~420 tok)
- `test-servicemonitor.yaml` — K8s Pod: "{{ (~1874 tok)

## deploy/charts/litellm-helm/tests/

- `deployment_command_args_labels_tests.yaml` (~478 tok)
- `deployment_tests.yaml` (~1243 tok)
- `ingress_tests.yaml` (~291 tok)
- `masterkey-secret_tests.yaml` (~238 tok)
- `migrations-job_tests.yaml` (~972 tok)
- `pdb_tests.yaml` (~338 tok)
- `service_tests.yaml` — Declares value (~846 tok)

## deploy/kubernetes/

- `kub.yaml` — K8s Deployment: litellm-deployment (~472 tok)
- `service.yaml` — K8s Service: litellm-service (~54 tok)

## docker/

- `build_admin_ui.sh` — # try except this script (~458 tok)
- `Dockerfile.alpine` — Base image for building (~408 tok)
- `Dockerfile.custom_ui` — Use the provided base image (~351 tok)
- `Dockerfile.database` — Base image for building (~641 tok)
- `Dockerfile.dev` — Base image for building (~642 tok)
- `Dockerfile.non_root` — Base images (~1970 tok)
- `entrypoint.sh` (~79 tok)
- `install_auto_router.sh` (~26 tok)
- `prod_entrypoint.sh` (~79 tok)
- `README.md` — Project documentation (~822 tok)
- `supervisord.conf` (~415 tok)

## docker/build_from_pip/

- `Dockerfile.build_from_pip` (~224 tok)
- `litellm_config.yaml` (~64 tok)
- `Readme.md` — Docker to build LiteLLM Proxy from litellm pip package (~84 tok)
- `requirements.txt` — Python dependencies (~45 tok)

## docker/tests/

- `nonroot.yaml` (~122 tok)

## docs/

- `2026-05-23-x51-deploy-server2-20260523.1826.md` — X51 Deploy Report: litellm-payment -> server2 (dev) (~1686 tok)
- `2026-05-23-x51-deploy-server2-payment-ui-v3.md` — Deploy Report: payment-ui-v3 (fix /ui/payment 404) (~490 tok)
- `2026-05-23-x51-deploy-server2-payment-ui-v4.md` — Deployment Report: LiteLLM payment-ui-v4 — Fix Payment API 401 (~606 tok)
- `2026-05-23-x51-deploy-server2-payment-ui.20260523.2020.md` — X51 Deploy Report: litellm (Payment UI) -> server2 (~1113 tok)
- `2026-05-23-x51-deploy-server2-startup-hook.md` — X51 Deploy Report: litellm-payment startup_hook -> server2 (~1318 tok)
- `enterprise-unlock-analysis.md` — LiteLLM Enterprise Feature Unlock Analysis (~3059 tok)

## docs/my-website/

- `.gitignore` — Git ignore rules (~71 tok)
- `.trivyignore` — js-yaml CVE-2025-64718 (~87 tok)
- `babel.config.js` — Babel configuration (~26 tok)
- `Dockerfile` — Docker container definition (~48 tok)
- `docusaurus.config.js` — @ts-check (~1948 tok)
- `index.md` (~196 tok)
- `package-lock.json` — npm lock file (~246510 tok)
- `package.json` — Node.js package manifest (~494 tok)
- `README.md` — Project documentation (~193 tok)
- `sidebars.js` — Creating a sidebar enables you to: (~7985 tok)

## docs/my-website/blog/

- `authors.yml` (~214 tok)

## docs/my-website/blog/anthropic_opus_4_5_and_advanced_features/

- `index.md` — Usage (~7526 tok)

## docs/my-website/blog/gemini_3/

- `index.md` — Quick Start (~7565 tok)

## docs/my-website/blog/gemini_3_flash/

- `index.md` — Gemini 3 Flash Day 0 Support (~1653 tok)

## docs/my-website/docs/

- `a2a_agent_permissions.md` — Agent Permission Management (~1704 tok)
- `a2a_cost_tracking.md` — A2A Agent Cost Tracking (~2347 tok)
- `a2a.md` — Agent Gateway (A2A Protocol) - Overview (~1976 tok)
- `aiohttp_benchmarks.md` — LiteLLM v1.71.1 Benchmarks (~411 tok)
- `anthropic_count_tokens.md` — /v1/messages/count_tokens (~1479 tok)
- `anthropic_unified.md` — /v1/messages (~4095 tok)
- `apply_guardrail.md` — /guardrails/apply_guardrail (~1039 tok)
- `assistants.md` — /assistants (~2154 tok)
- `audio_transcription.md` — /audio/transcriptions (~1234 tok)
- `batches.md` — /batches (~3240 tok)
- `bedrock_converse.md` — /converse (~938 tok)
- `bedrock_invoke.md` — /invoke (~948 tok)
- `benchmarks.md` — Benchmarks (~1993 tok)
- `budget_manager.md` — Budget Manager (~1979 tok)
- `contact.md` — Contact Us (~78 tok)
- `container_files.md` — Container Files API (~1657 tok)
- `containers.md` — /containers (~2734 tok)
- `contributing.md` — Contributing - UI (~205 tok)
- `data_retention.md` — Data Retention Policy (~755 tok)
- `data_security.md` — Data Privacy and Security (~1795 tok)
- `default_code_snippet.md` — Get Started (~108 tok)
- `enterprise.md` — Enterprise (~1040 tok)
- `exception_mapping.md` — Exception Mapping (~3946 tok)
- `files_endpoints.md` — Provider Files Endpoints (~1998 tok)
- `fine_tuning.md` — /fine_tuning (~1842 tok)
- `generateContent.md` — /generateContent (~1227 tok)
- `image_edits.md` — /images/edits (~3195 tok)
- `image_generation.md` — Image Generations (~2575 tok)
- `image_variations.md` — [BETA] Image Variations (~120 tok)
- `index.md` — LiteLLM - Getting Started (~4599 tok)
- `interactions.md` — /interactions (~1265 tok)
- `load_test_advanced.md` — LiteLLM Proxy - 1K RPS Load test on locust (~2046 tok)
- `load_test_rpm.md` — Multi-Instance TPM/RPM (litellm.Router) (~2569 tok)
- `load_test_sdk.md` — LiteLLM SDK vs OpenAI (~606 tok)
- `load_test.md` — LiteLLM Proxy - Locust Load Test (~356 tok)
- `mcp_control.md` — MCP Permission Management (~4859 tok)
- `mcp_cost.md` — MCP Cost Tracking (~819 tok)
- `mcp_guardrail.md` — MCP Guardrails (~727 tok)
- `mcp_usage.md` — Using your MCP (~1485 tok)
- `mcp.md` — MCP Overview (~12347 tok)
- `migration_policy.md` — Migration Policy (~173 tok)
- `migration.md` — Migration Guide - LiteLLM v1.0.0+ (~319 tok)
- `moderation.md` — /moderations (~1002 tok)
- `ocr.md` — /ocr (~1684 tok)
- `oidc.md` — [BETA] OpenID Connect (OIDC) (~2424 tok)
- `old_guardrails.md` — 🛡️ [Beta] Guardrails (~2226 tok)
- `projects.md` — Projects Built on LiteLLM (~128 tok)
- `proxy_api.md` — 🔑 LiteLLM Keys (Access Claude-2, Llama2-70b, etc.) (~721 tok)
- `proxy_server.md` — [OLD PROXY 👉 [NEW proxy here](./simple_proxy)] Local LiteLLM Proxy Server (~5364 tok)
- `rag_ingest.md` — /rag/ingest (~2296 tok)
- `realtime.md` — /realtime (~608 tok)
- `reasoning_content.md` — 'Thinking' / 'Reasoning Content' (~5133 tok)
- `rerank.md` — /rerank (~1122 tok)
- `response_api.md` — /responses (~8463 tok)
- `router_architecture.md` — Router Architecture (Fallbacks / Retries) (~397 tok)
- `routing.md` — Router - Load Balancing (~12977 tok)
- `rules.md` — Rules (~679 tok)
- `scheduler.md` — [BETA] Request Prioritization (~1092 tok)
- `sdk_custom_pricing.md` — Custom Pricing - SageMaker, Azure, etc (~450 tok)
- `secret.md` — Secret Managers Overview (~449 tok)
- `set_keys.md` — Setting API Keys, Base, Version (~1393 tok)
- `skills.md` — /skills - Anthropic Skills API (~2937 tok)
- `text_completion.md` — /completions (~1311 tok)
- `text_to_speech.md` — /audio/speech (~1874 tok)
- `troubleshoot.md` — Support & Talk with founders (~167 tok)
- `vector_store_files.md` — /vector_stores/\{vector_store_id\}/files (~857 tok)
- `vertex_batch_passthrough.md` — /batchPredictionJobs (~1334 tok)
- `videos.md` — /videos (~3758 tok)
- `wildcard_routing.md` — Provider specific Wildcard routing (~1025 tok)

## docs/my-website/docs/adding_provider/

- `adding_guardrail_support.md` — Adding Guardrail Support to Endpoints (~2867 tok)
- `directory_structure.md` — Directory Structure (~219 tok)
- `generic_guardrail_api.md` — [BETA] Generic Guardrail API - Integrate Without a PR (~3339 tok)
- `new_rerank_provider.md` — Add Rerank Provider (~662 tok)
- `simple_guardrail_tutorial.md` — Adding a New Guardrail Integration (~799 tok)

## docs/my-website/docs/caching/

- `all_caches.md` — Caching - In-Memory, Redis, s3, gcs, Redis Semantic Cache, Disk (~4521 tok)
- `caching_api.md` — Hosted Cache - api.litellm.ai (~496 tok)
- `local_caching.md` — LiteLLM - Local Caching (~600 tok)

## docs/my-website/docs/completion/

- `audio.md` — Using Audio Models (~1928 tok)
- `batching.md` — Batching Completion() (~1688 tok)
- `computer_use.md` — Computer Use (~2623 tok)
- `document_understanding.md` — Using PDF Input (~2245 tok)
- `drop_params.md` — Drop Unsupported Params (~1763 tok)
- `function_call.md` — Function Calling (~5033 tok)
- `http_handler_config.md` — Custom HTTP Handler (~899 tok)
- `image_generation_chat.md` — Image Generation in Chat Completions, Responses API (~1808 tok)
- `input.md` — Input Params (~3557 tok)
- `json_mode.md` — Structured Outputs (JSON Mode) (~2098 tok)
- `knowledgebase.md` — Using Vector Stores (Knowledge Bases) (~5651 tok)
- `message_trimming.md` — Trimming Input Messages (~301 tok)
- `mock_requests.md` — Mock Completion() Responses - Save Testing Costs 💰 (~514 tok)
- `model_alias.md` — Model Alias (~350 tok)
- `multiple_deployments.md` — Multiple Deployments (~428 tok)
- `output.md` — Output (~434 tok)
- `predict_outputs.md` — Predicted Outputs (~694 tok)
- `prefix.md` — Pre-fix Assistant Messages (~594 tok)
- `prompt_caching.md` — Prompt Caching (~3534 tok)
- `prompt_formatting.md` — Prompt Formatting (~1665 tok)
- `provider_specific_params.md` — Provider-specific Params (~3177 tok)
- `reliable_completions.md` — Reliability - Retries, Fallbacks (~1642 tok)
- `shared_session.md` — Shared Session Support (~1486 tok)
- `stream.md` — Streaming + Async (~1149 tok)
- `token_usage.md` — Completion Token Usage & Cost (~1758 tok)
- `usage.md` — Usage (~371 tok)
- `vision.md` — Using Vision Models (~2008 tok)
- `web_fetch.md` — Web Fetch (~1656 tok)
- `web_search.md` — Web Search (~3153 tok)

## docs/my-website/docs/contribute_integration/

- `custom_webhook_api.md` — Contribute Custom Webhook API (~755 tok)

## docs/my-website/docs/contributing/

- `adding_openai_compatible_providers.md` — Adding OpenAI-Compatible Providers (~713 tok)

## docs/my-website/docs/debugging/

- `hosted_debugging.md` (~0 tok)
- `local_debugging.md` — Local Debugging (~580 tok)

## docs/my-website/docs/embedding/

- `async_embedding.md` — litellm.aembedding() (~98 tok)
- `moderation.md` — litellm.moderation() (~59 tok)
- `supported_embedding.md` — /embeddings (~5708 tok)

## docs/my-website/docs/extras/

- `code_quality.md` — Code Quality (~225 tok)
- `contributing_code.md` — Contributing Code (~915 tok)
- `contributing.md` — Contributing to Documentation (~376 tok)
- `creating_adapters.md` — Call any LiteLLM model in your custom format (~1402 tok)
- `gemini_img_migration.md` — Gemini Image Generation Migration Guide (~1304 tok)

## docs/my-website/docs/guides/

- `code_interpreter.md` — Code Interpreter (~1027 tok)
- `finetuned_models.md` — Calling Finetuned Models (~529 tok)
- `security_settings.md` — SSL, HTTP Proxy Security Settings (~1115 tok)

## docs/my-website/docs/integrations/

- `community.md` — Be an Integration Partner (~278 tok)
- `index.md` — Integrations (~187 tok)
- `letta.md` — Letta Integration (~5950 tok)

## docs/my-website/docs/langchain/

- `langchain.md` — Using ChatLiteLLM() - Langchain (~3030 tok)

## docs/my-website/docs/observability/

- `agentops_integration.md` — 🖇️ AgentOps - LLM Observability Platform (~569 tok)
- `argilla.md` — Argilla (~642 tok)
- `arize_integration.md` — Arize AI (~1109 tok)
- `athina_integration.md` — Athina (~1144 tok)
- `azure_sentinel.md` — Azure Sentinel (~3566 tok)
- `braintrust.md` — Braintrust - Evals + Logging (~1383 tok)
- `callbacks.md` — Callbacks (~726 tok)
- `cloudzero.md` — CloudZero Integration (~1600 tok)
- `custom_callback.md` — Custom Callbacks (~2207 tok)
- `datadog.md` — DataDog (~1801 tok)
- `deepeval_integration.md` — 🔭 DeepEval - Open-Source Evals with Tracing (~429 tok)
- `gcs_bucket_integration.md` — Google Cloud Storage Buckets (~518 tok)
- `generic_api.md` — Generic API Callback (Webhook) (~649 tok)
- `greenscale_integration.md` — Greenscale - Track LLM Spend and Responsible Usage (~586 tok)
- `helicone_integration.md` — Helicone - OSS LLM Observability Platform (~2355 tok)
- `humanloop.md` — Humanloop (~866 tok)
- `lago.md` — Lago - Usage Based Billing (~1051 tok)
- `langfuse_integration.md` — 🪢 Langfuse - Logging LLM Input/Output (~2716 tok)
- `langfuse_otel_integration.md` — 🪢 Langfuse OpenTelemetry Integration (~1918 tok)
- `langsmith_integration.md` — Langsmith - Logging LLM Input/Output (~1380 tok)
- `langtrace_integration.md` — Langtrace AI (~318 tok)
- `literalai_integration.md` — Literal AI - Log, Evaluate, Monitor (~843 tok)
- `logfire_integration.md` — Logfire (~397 tok)
- `lunary_integration.md` — 🌙 Lunary - GenAI Observability (~1147 tok)
- `mlflow.md` — 🔁 MLflow - OSS LLM Observability and Evaluation (~1800 tok)
- `openmeter.md` — OpenMeter - Usage-Based Billing (~543 tok)
- `opentelemetry_integration.md` — OpenTelemetry - Tracing LLMs with any observability tool (~953 tok)
- `opik_integration.md` — Comet Opik - Logging + Evals (~1845 tok)
- `phoenix_integration.md` — Arize Phoenix OSS (~999 tok)
- `posthog_integration.md` — PostHog - Tracking LLM Usage Analytics (~1628 tok)
- `promptlayer_integration.md` — Promptlayer Tutorial (~666 tok)
- `raw_request_response.md` — Raw Request/Response Logging (~584 tok)
- `scrub_data.md` — Scrub Logged Data (~664 tok)
- `sentry.md` — Sentry - Log LLM Exceptions (~682 tok)
- `slack_integration.md` — Slack - Logging LLM Input/Output, Exceptions (~781 tok)
- `sumologic_integration.md` — Sumo Logic (~1836 tok)
- `supabase_integration.md` — Supabase Tutorial (~829 tok)
- `telemetry.md` — Telemetry (~36 tok)
- `wandb_integration.md` — Weights & Biases - Logging LLM Input/Output (~390 tok)

## docs/my-website/docs/pass_through/

- `anthropic_completion.md` — Anthropic Passthrough (~2481 tok)
- `assembly_ai.md` — Assembly AI (~596 tok)
- `azure_passthrough.md` — Azure Passthrough (~525 tok)
- `bedrock.md` — Bedrock (boto3) SDK (~3704 tok)
- `cohere.md` — Cohere SDK (~2325 tok)
- `google_ai_studio.md` — Google AI Studio SDK (~2137 tok)
- `intro.md` — Why Pass-Through Endpoints? (~499 tok)
- `langfuse.md` — Langfuse SDK (~741 tok)
- `mistral.md` — Mistral (~1259 tok)
- `openai_passthrough.md` — OpenAI Passthrough (~560 tok)
- `vertex_ai_live_websocket.md` — Vertex AI Live API WebSocket Passthrough (~1894 tok)
- `vertex_ai_search_datastores.md` — Vertex AI Search Datastores (~957 tok)
- `vertex_ai.md` — Vertex AI SDK (~3129 tok)
- `vllm.md` — VLLM (~1104 tok)

## docs/my-website/docs/projects/

- `Agent Lightning.md` — Agent Lightning (~167 tok)
- `Codium PR Agent.md` (~34 tok)
- `dbally.md` (~48 tok)
- `Docq.AI.md` (~257 tok)
- `Elroy.md` — 🐕 Elroy (~140 tok)
- `FastREPL.md` (~34 tok)
- `Google ADK.md` — Google ADK (Agent Development Kit) (~214 tok)
- `GPT Migrate.md` (~18 tok)
- `GPTLocalhost.md` — GPTLocalhost (~50 tok)
- `GraphRAG.md` — Microsoft GraphRAG (~114 tok)
- `Harbor.md` — Harbor (~193 tok)
- `HolmesGPT.md` — HolmesGPT (~127 tok)
- `Langstream.md` (~41 tok)
- `LiteLLM Proxy.md` — ## LiteLLM Proxy (~37 tok)
- `llm_cord.md` — llmcord.py (~55 tok)
- `mini-swe-agent.md` — mini-swe-agent (~171 tok)
- `openai-agents.md` — OpenAI Agents SDK (~200 tok)
- `OpenInterpreter.md` (~33 tok)
- `Otter.md` (~60 tok)
- `PDL.md` (~65 tok)
- `pgai.md` — pgai (~162 tok)
- `Prompt2Model.md` (~76 tok)
- `PROMPTMETHEUS.md` (~131 tok)
- `Quivr.md` (~47 tok)
- `Railtracks.md` — Railtracks (~77 tok)
- `SalesGPT.md` (~26 tok)
- `smolagents.md` — 🤗 Smolagents (~80 tok)
- `Softgen.md` — Softgen (~62 tok)
- `YiVal.md` (~99 tok)

## docs/my-website/docs/provider_registration/

- `add_model_pricing.md` (~1110 tok)
- `index.md` — Quick Start for OpenAI-Compatible Providers (~2212 tok)

## docs/my-website/docs/providers/

- `ai21.md` — AI21 (~1380 tok)
- `aiml.md` — AI/ML API (~1233 tok)
- `aleph_alpha.md` — Aleph Alpha (~339 tok)
- `amazon_nova.md` — Amazon Nova (~1697 tok)
- `anthropic_effort.md` — Anthropic Effort Parameter (~2453 tok)
- `anthropic_programmatic_tool_calling.md` — Anthropic Programmatic Tool Calling (~3571 tok)
- `anthropic_tool_input_examples.md` — Anthropic Tool Input Examples (~3386 tok)
- `anthropic_tool_search.md` — Anthropic Tool Search (~2926 tok)
- `anthropic.md` — Anthropic (~13073 tok)
- `anyscale.md` — Anyscale (~454 tok)
- `aws_sagemaker.md` — AWS Sagemaker (~3468 tok)
- `azure_ai_agents.md` — Azure AI Foundry Agents (~4285 tok)
- `azure_ai_img_edit.md` — Azure AI Image Editing (~2109 tok)
- `azure_ai_img.md` — Azure AI Image Generation (~1990 tok)
- `azure_ai_speech.md` — Azure AI Speech (Cognitive Services) (~3725 tok)
- `azure_ai_vector_stores.md` — Azure AI Search - Vector Store (Unified API) (~1670 tok)
- `azure_ai.md` — Azure AI Studio (~2881 tok)
- `azure_document_intelligence.md` — Azure Document Intelligence OCR (~2815 tok)
- `azure_ocr.md` — Azure AI OCR (Mistral) (~945 tok)
- `baseten.md` — Baseten (~607 tok)
- `bedrock_agentcore.md` — Bedrock AgentCore (~1753 tok)
- `bedrock_agents.md` — Bedrock Agents (~1556 tok)
- `bedrock_batches.md` — Bedrock Batches (~2403 tok)
- `bedrock_embedding.md` — Bedrock Embedding (~3112 tok)
- `bedrock_image_gen.md` — AWS Bedrock - Image Generation (~1069 tok)
- `bedrock_imported.md` — Bedrock Imported Models (~2837 tok)
- `bedrock_rerank.md` — AWS Bedrock - Rerank API (~591 tok)
- `bedrock_vector_store.md` — Bedrock Knowledge Bases (~1884 tok)
- `bedrock_writer.md` — Bedrock - Writer Palmyra (~1951 tok)
- `bedrock.md` — AWS Bedrock (~17469 tok)
- `bytez.md` — Bytez (~978 tok)
- `cerebras.md` — Cerebras (~792 tok)
- `clarifai.md` — Clarifai (~2052 tok)
- `cloudflare_workers.md` — Cloudflare Workers AI (~425 tok)
- `codestral.md` — Codestral API [Mistral AI] (~1519 tok)
- `cohere.md` — Cohere (~2317 tok)
- `cometapi.md` — CometAPI (~1024 tok)
- `compactifai.md` — CompactifAI (~1404 tok)
- `custom_llm_server.md` — Custom API Server (Custom Format) (~4202 tok)
- `dashscope.md` — Dashscope (Qwen API) (~640 tok)
- `databricks.md` — Databricks (~2854 tok)
- `datarobot.md` — DataRobot (~358 tok)
- `deepgram.md` — Deepgram (~438 tok)
- `deepinfra.md` — DeepInfra (~1335 tok)
- `deepseek.md` — Deepseek (~1089 tok)
- `docker_model_runner.md` — Docker Model Runner (~1991 tok)
- `elevenlabs.md` — ElevenLabs (~3295 tok)
- `empower.md` — Empower (~681 tok)
- `fal_ai.md` — Fal AI (~2297 tok)
- `featherless_ai.md` — Featherless AI (~646 tok)
- `fireworks_ai.md` — Fireworks AI (~3556 tok)
- `friendliai.md` — FriendliAI (~534 tok)
- `galadriel.md` — Galadriel (~527 tok)
- `gemini_file_search.md` — Gemini File Search (~2538 tok)
- `gemini.md` — Gemini - Google AI Studio (~14452 tok)
- `github_copilot.md` — GitHub Copilot (~1484 tok)
- `github.md` — Github (~1879 tok)
- `gradient_ai.md` — GradientAI (~866 tok)
- `groq.md` — Groq (~2512 tok)
- `helicone.md` — Helicone (~1929 tok)
- `heroku.md` — Heroku (~806 tok)
- `huggingface_rerank.md` — HuggingFace Rerank (~1675 tok)
- `huggingface.md` — Hugging Face (~2998 tok)
- `hyperbolic.md` — Hyperbolic (~2588 tok)
- `infinity.md` — Infinity (~1924 tok)
- `jina_ai.md` — Jina AI (~944 tok)
- `lambda_ai.md` — Lambda AI (~1859 tok)
- `langgraph.md` — LangGraph (~2693 tok)
- `lemonade.md` — Lemonade (~1210 tok)
- `litellm_proxy.md` — LiteLLM Proxy (LLM Gateway) (~1641 tok)
- `llamafile.md` — Llamafile (~1091 tok)
- `lm_studio.md` — LM Studio (~963 tok)
- `meta_llama.md` — Meta Llama (~2182 tok)

## docs/my-website/docs/providers/azure/

- `azure_anthropic.md` — Azure Anthropic (Claude via Azure Foundry) (~2490 tok)
- `azure_embedding.md` — Azure OpenAI Embeddings (~534 tok)
- `azure_responses.md` — Azure Responses API (~1879 tok)
- `azure_speech.md` — Azure Text to Speech (tts) (~534 tok)
- `azure.md` — Azure OpenAI (~9499 tok)
- `videos.md` — Azure Video Generation (~1664 tok)

## docs/my-website/docs/providers/azure_ai/

- `azure_ai_vector_stores_passthrough.md` — Azure AI Search - Vector Store (Passthrough API) (~2964 tok)

## docs/my-website/docs/providers/gemini/

- `videos.md` — Gemini Video Generation (Veo) (~2819 tok)

## docs/my-website/docs/providers/google_ai_studio/

- `files.md` — [BETA] Google AI Studio (Gemini) Files API (~1799 tok)
- `image_gen.md` — Google AI Studio Image Generation (~1432 tok)
- `realtime.md` — Gemini Realtime API - Google AI Studio (~498 tok)

## openspec/changes/add-user-registration-enforcement/

- `design.md` — Context (~1056 tok)
- `proposal.md` — Why (~563 tok)
- `tasks.md` — 1. Registration Endpoints (~645 tok)

## openspec/changes/add-user-registration-enforcement/specs/balance-gate-enforcement/

- `spec.md` — ADDED Requirements (~684 tok)

## openspec/changes/add-user-registration-enforcement/specs/user-registration/

- `spec.md` — ADDED Requirements (~653 tok)

## openspec/changes/complete-payment-integration/

- `design.md` — Context (~911 tok)
- `proposal.md` — Why (~457 tok)
- `tasks.md` — 1. Fix PaymentCallbackHandler to inherit CustomLogger (~677 tok)

## openspec/changes/complete-payment-integration/specs/payment-callback-integration/

- `spec.md` — ADDED Requirements (~929 tok)

## openspec/changes/fix-openapi-json-500/

- `design.md` — Context (~594 tok)
- `proposal.md` — Why (~153 tok)
- `tasks.md` — 1. Code Fix (~343 tok)

## openspec/changes/fix-openapi-json-500/specs/openapi-schema-generation/

- `spec.md` — MODIFIED Requirements (~232 tok)

## openspec/changes/fix-payment-api-auth/

- `design.md` — Context (~1017 tok)
- `proposal.md` — Why (~443 tok)
- `tasks.md` — 1. Fix Payment Router Auth (~612 tok)

## openspec/changes/fix-payment-api-auth/specs/payment-api-auth/

- `spec.md` — MODIFIED Requirements (~415 tok)

## openspec/changes/fix-payment-page-access/

- `design.md` — Context (~771 tok)
- `proposal.md` — Why (~380 tok)
- `tasks.md` — 1. Dockerfile Fix (~328 tok)

## openspec/changes/fix-payment-page-access/specs/payment-page-routing/

- `spec.md` — ADDED Requirements (~240 tok)

## openspec/changes/fix-payment-ui-and-merge-build/

- `design.md` — Context (~969 tok)
- `proposal.md` — Why (~555 tok)
- `tasks.md` — 1. Fix UI Static Export (Split-Brain Layout) (~364 tok)

## openspec/changes/fix-payment-ui-and-merge-build/specs/merged-payment-build/

- `spec.md` — ADDED Requirements (~486 tok)

## openspec/changes/fix-payment-ui-and-merge-build/specs/payment-in-sidebar/

- `spec.md` — MODIFIED Requirements (~283 tok)

## openspec/changes/fix-payment-ui-sync/

- `design.md` — Context (~858 tok)
- `proposal.md` — Why (~318 tok)
- `tasks.md` — 1. Prepare Static Files (~799 tok)

## openspec/changes/fix-payment-ui-sync/specs/payment-in-sidebar/

- `spec.md` — ADDED Requirements (~164 tok)

## openspec/changes/fix-payment-user-identity/

- `design.md` — Context (~813 tok)
- `proposal.md` — Why (~218 tok)
- `tasks.md` — 1. Code Fix (~301 tok)

## openspec/changes/fix-payment-user-identity/specs/user-identity-resolution/

- `spec.md` — ADDED Requirements (~467 tok)

## openspec/changes/litellm-payment-module/

- `tasks.md` — 1. Repository & Package Setup (~1050 tok)

## ui/litellm-dashboard/src/app/(dashboard)/components/

- `Sidebar2.tsx` — Fallback selection id (legacy), used if path can't be matched (~3582 tok)

## ui/litellm-dashboard/src/app/(dashboard)/payment/

- `page.tsx` — PaymentPage (~108 tok)
- `PaymentView.tsx` — PaymentView (~1114 tok)

## ui/litellm-dashboard/src/app/(dashboard)/payment/components/

- `AdminCreditModal.tsx` — AdminCreditModal — renders form, modal (~791 tok)
- `BalanceCard.tsx` — BalanceCard (~309 tok)
- `PaymentHistoryTable.tsx` — PaymentHistoryTable — renders table (~1589 tok)
- `TopUpModal.tsx` — PRESET_AMOUNTS — renders modal (~1515 tok)

## ui/litellm-dashboard/src/app/(dashboard)/payment/hooks/

- `usePayment.ts` — Exports UserBalance, PaymentIntent, PaymentTxn, PaymentListResponse, usePayment (~1138 tok)
