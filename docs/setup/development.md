# Development Environment Setup

## Prerequisites

### Required Software
- Node.js (v18+)
- npm (v9+)
- Git
- VS Code (recommended)

### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens"
  ]
}
```

## Initial Setup

### 1. Repository Setup
```bash
# Clone repository
git clone https://github.com/user/mmv-clean.git
cd mmv-clean

# Install dependencies
npm install

# Setup hooks
npx husky install

# Configure git
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Create develop branch
git checkout -b develop
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure environment
code .env

# Verify configuration
npm run verify-env
```

### 3. Development Tools
```bash
# Install global tools
npm install -g typescript
npm install -g eslint
npm install -g prettier

# Configure VS Code
cp .vscode/settings.example.json .vscode/settings.json
```

## Development Workflow

### 1. Daily Development
```bash
# Update develop branch
git checkout develop
git pull origin develop

# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### 2. Code Quality Tools
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck

# Run all checks
npm run verify
```

### 3. Testing
```bash
# Run all tests
npm test

# Run specific tests
npm test -- --testPathPattern=resourceSlice

# Check coverage
npm run test:coverage
```

## Project Structure

### Core Directories
```
/src
  /domain          # Business logic
    /entities      # Core business objects
    /services      # Business operations
    /types         # TypeScript types
  
  /presentation   # UI layer
    /components   # Reusable components
    /layouts      # Page layouts
    /pages        # Full pages
  
  /infrastructure # Technical concerns
    /store        # Redux store
    /api          # External services
    /config       # Configuration
    
  /tests         # Test files
    /unit        # Unit tests
    /integration # Integration tests
    /e2e         # End-to-end tests
```

### Configuration Files
```
.
├── .env                 # Environment variables
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── jest.config.js      # Jest configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Common Development Tasks

### 1. Creating New Components
```bash
# Create component directory
mkdir -p src/presentation/components/MyComponent

# Create component files
touch src/presentation/components/MyComponent/index.tsx
touch src/presentation/components/MyComponent/MyComponent.tsx
touch src/presentation/components/MyComponent/MyComponent.test.tsx
touch src/presentation/components/MyComponent/types.ts
touch src/presentation/components/MyComponent/README.md
```

### 2. Adding New Features
```bash
# Create feature branch
git checkout -b feature/new-feature

# Create feature directory
mkdir -p src/domain/features/newFeature

# Create feature files
touch src/domain/features/newFeature/index.ts
touch src/domain/features/newFeature/types.ts
touch src/domain/features/newFeature/service.ts
touch src/domain/features/newFeature/README.md
```

### 3. Updating Store
```bash
# Create slice
touch src/store/slices/newSlice.ts
touch src/store/slices/newSlice.test.ts

# Update root reducer
code src/store/index.ts
```

### 4. Adding Tests
```bash
# Unit tests
touch src/tests/unit/components/MyComponent.test.tsx
touch src/tests/unit/services/MyService.test.ts

# Integration tests
touch src/tests/integration/features/MyFeature.test.ts

# E2E tests
touch src/tests/e2e/workflows/MyWorkflow.test.ts
```

## Troubleshooting

### Common Issues

1. **Build Failures**
```bash
# Clear build cache
npm run clean

# Reinstall dependencies
rm -rf node_modules
npm install

# Verify TypeScript
npm run typecheck
```

2. **Test Failures**
```bash
# Update snapshots
npm test -- -u

# Clear Jest cache
npm test -- --clearCache

# Debug specific tests
npm test -- --testPathPattern=MyComponent --debug
```

3. **Development Server Issues**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart with logging
DEBUG=vite:* npm run dev
```

## Performance Optimization

### Development Performance
```bash
# Enable fast refresh only
FAST_REFRESH=true npm run dev

# Disable source maps
GENERATE_SOURCEMAP=false npm run dev

# Use cache
VITE_USE_CACHE=true npm run dev
```

### Build Optimization
```bash
# Analyze bundle
npm run analyze

# Production build
npm run build -- --mode production

# Generate stats
npm run build -- --stats
```

## Documentation

### Code Documentation
```bash
# Generate documentation
npm run docs

# Serve documentation
npm run docs:serve

# Check documentation coverage
npm run docs:coverage
```

### Architecture Documentation
```bash
# View architecture
code docs/architecture/overview.md

# Update diagrams
npm run generate-diagrams
```

## Deployment

### Development Deployment
```bash
# Build for development
npm run build:dev

# Deploy to development
npm run deploy:dev
```

### Staging Deployment
```bash
# Build for staging
npm run build:staging

# Deploy to staging
npm run deploy:staging
```

### Production Deployment
```bash
# Build for production
npm run build:prod

# Deploy to production
npm run deploy:prod
```
