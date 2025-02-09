# Deployment Guide

## Environment Setup

### Environment Variables
```bash
# Production
VITE_API_URL=https://api.production.com
VITE_ENVIRONMENT=production
VITE_ANALYTICS_ID=UA-XXXXX-X

# Staging
VITE_API_URL=https://api.staging.com
VITE_ENVIRONMENT=staging
VITE_ANALYTICS_ID=UA-XXXXX-Y

# Development
VITE_API_URL=https://api.dev.com
VITE_ENVIRONMENT=development
VITE_ANALYTICS_ID=UA-XXXXX-Z
```

## Build Configuration

### Build Scripts
```json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production"
  }
}
```

### Build Options
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_ENVIRONMENT !== 'production',
    minify: process.env.VITE_ENVIRONMENT === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'redux'],
          game: ['./src/domain/game/**'],
        }
      }
    }
  }
});
```

## Deployment Process

### 1. Pre-deployment Checks
```bash
# Run tests
npm run test:coverage

# Type check
npm run typecheck

# Lint
npm run lint

# Build verification
npm run build:prod
npm run preview
```

### 2. Deployment Steps

#### Development
```bash
# Build
npm run build:dev

# Deploy to development server
npm run deploy:dev

# Verify deployment
npm run verify:dev
```

#### Staging
```bash
# Build
npm run build:staging

# Deploy to staging
npm run deploy:staging

# Run integration tests
npm run test:integration:staging

# Verify deployment
npm run verify:staging
```

#### Production
```bash
# Create release branch
git checkout -b release/v1.0.0

# Build
npm run build:prod

# Run final checks
npm run verify:prod

# Deploy to production
npm run deploy:prod

# Tag release
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

## Monitoring & Analytics

### Performance Monitoring
```typescript
// Monitor build size
import { analyzeBundle } from './scripts/analyze';
analyzeBundle();

// Monitor runtime performance
import { initPerformanceMonitoring } from './monitoring';
initPerformanceMonitoring();
```

### Error Tracking
```typescript
// Error boundary configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VITE_ENVIRONMENT
});
```

### Analytics Setup
```typescript
// Google Analytics configuration
import { Analytics } from './analytics';

Analytics.init({
  id: process.env.VITE_ANALYTICS_ID,
  options: {
    debug: process.env.VITE_ENVIRONMENT !== 'production'
  }
});
```

## Rollback Procedures

### Quick Rollback
```bash
# Revert to last stable tag
git checkout v1.0.0

# Emergency build
npm run build:prod

# Deploy previous version
npm run deploy:prod:quick
```

### Controlled Rollback
```bash
# Create rollback branch
git checkout -b rollback/v1.0.0

# Reset to stable state
git reset --hard v1.0.0

# Verify build
npm run build:prod
npm run verify:prod

# Deploy rollback
npm run deploy:prod
```

## Security Measures

### Security Headers
```typescript
// Security middleware configuration
export const securityHeaders = {
  'Content-Security-Policy': 'default-src \'self\'',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

### Environment Protection
```bash
# Production protection
if [[ "$VITE_ENVIRONMENT" == "production" ]]; then
  # Additional security checks
  npm run security:audit
  npm run dependency:audit
fi
```

## CI/CD Pipeline

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build:prod

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: npm run deploy:prod
```

### Automated Testing
```yaml
name: Automated Testing

on:
  schedule:
    - cron: '0 0 * * *'

jobs:
  integration:
    runs-on: ubuntu-latest
    steps:
      - name: Run integration tests
        run: npm run test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - name: Run E2E tests
        run: npm run test:e2e
```

## Post-Deployment

### Verification
```bash
# Health check
curl -I https://app.production.com/health

# Smoke tests
npm run test:smoke

# Performance check
npm run lighthouse
```

### Monitoring
```bash
# Check error rates
npm run monitor:errors

# Check performance metrics
npm run monitor:performance

# Generate deployment report
npm run generate:report
```

## Documentation

### Release Notes
```markdown
# Release v1.0.0

## New Features
- Feature A
- Feature B

## Bug Fixes
- Fix X
- Fix Y

## Performance Improvements
- Optimization 1
- Optimization 2
```

### Deployment History
```bash
# Generate deployment history
npm run deployment:history > DEPLOYMENTS.md

# Update documentation
npm run docs:deployment
```