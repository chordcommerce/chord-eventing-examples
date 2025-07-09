# Deployment Setup

This repository is configured to deploy the `hydrogen-quickstart` directory to Shopify Oxygen using GitHub Actions.

## Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy-to-oxygen.yml`) is configured to:

1. **Trigger on changes** to the `hydrogen-quickstart/**` directory
2. **Run tests** on all pushes and pull requests
3. **Deploy** only when changes are pushed to `main` or `master` branch

## Required Secrets

You need to configure the following secrets in your GitHub repository settings:

- `SHOPIFY_CLI_TOKEN`: Your Shopify CLI authentication token
- `SHOPIFY_STORE`: Your Shopify store domain (e.g., `your-store.myshopify.com`)

## Workflow Steps

### Test Job
- Installs dependencies in the `hydrogen-quickstart` directory
- Runs linting checks (with continue-on-error to prevent failures)
- Builds the project

### Deploy Job (Main/Master only)
- Installs dependencies
- Builds the project
- Deploys to Shopify Oxygen using `npx @shopify/cli oxygen deploy`

## Environment Variables

Make sure your `hydrogen-quickstart/.env` file contains the necessary Chord Analytics configuration:

```
PUBLIC_CHORD_OMS_ID: your-chord-oms-id
PUBLIC_CHORD_STORE_ID: your-chord-store-id
PUBLIC_CHORD_TENANT_ID: your-chord-tenant-id
PUBLIC_CHORD_CDP_DOMAIN: https://production.cdp.ingest.chord.co
PUBLIC_CHORD_CDP_WRITE_KEY: your-chord-cdp-write-key
PUBLIC_CHECKOUT_DOMAIN: your-store.myshopify.com
```

## Manual Deployment

You can also trigger the workflow manually using the "workflow_dispatch" trigger in the GitHub Actions tab.

## Linting and Code Quality

The workflow runs linting checks but continues deployment even if warnings remain:
- Linting errors are logged but don't block deployment
- The `continue-on-error: true` flag ensures the workflow continues
- Critical React Hook violations have been fixed in the codebase

## Troubleshooting

If you encounter the `npm ci` error, ensure that:
1. The workflow is running in the correct directory (`hydrogen-quickstart`)
2. The `package-lock.json` file exists in the `hydrogen-quickstart` directory
3. The `cache-dependency-path` is correctly set to `hydrogen-quickstart/package-lock.json` 