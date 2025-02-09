# Middle Age Multiverse (MMV)

## Git Version Control Policies

### Branch Structure
```
main               # Production code
│
├── develop        # Integration branch
│   │
│   ├── feature/* # Feature branches
│   ├── bugfix/*  # Bug fixes
│   ├── config/*  # Configuration changes
│   └── docs/*    # Documentation updates
```

### Development Checkpoint Policy

After completing any major section:

1. **Commit Current Work**
```bash
git add .
git commit -m "feat(scope): complete [section-name]

- List main changes
- List key additions
- List potential impacts"
```

2. **Update Development Branch**
```bash
git checkout develop
git pull origin develop
git merge feature/your-feature
git push origin develop
```

3. **Tag Major Sections**
```bash
git tag -a v0.1.0-section-name -m "Complete [section-name]"
git push origin v0.1.0-section-name
```

4. **Document Progress**
```bash
# Update progress in docs
code docs/progress.md

# Create progress commit
git add docs/progress.md
git commit -m "docs: update progress for [section-name]"
```

### Preventing Circular Development

#### Before Starting New Work:
1. **Review Existing Implementation**
```bash
# Check existing code
git log --oneline -- path/to/related/files

# Review documentation
git log --oneline -- docs/
```

2. **Create Feature Branch**
```bash
git checkout -b feature/new-feature develop
```

3. **Document Intent**
```bash
# Create feature doc
code docs/features/new-feature.md

# Commit documentation
git add docs/features/new-feature.md
git commit -m "docs: add feature plan for [feature-name]"
```

#### During Development:
1. **Regular Checkpoints**
```bash
# Every major component
git commit -m "feat(component): complete [component-name]

- List what's done
- List what's next
- List dependencies"
```

2. **Update Feature Documentation**
```bash
# Update progress
code docs/features/new-feature.md

# Commit updates
git add docs/features/new-feature.md
git commit -m "docs: update progress on [feature-name]"
```

#### After Completion:
1. **Review Changes**
```bash
# Review changes
git diff develop...feature/new-feature

# Check for conflicts
git checkout develop
git pull origin develop
git checkout feature/new-feature
git merge develop
```

2. **Final Documentation**
```bash
# Update all relevant docs
git add docs/
git commit -m "docs: complete documentation for [feature-name]"
```

3. **Create Pull Request**
- Use PR template
- Link related issues
- List completed items
- List potential impacts

## Project Documentation

For full documentation, see the [docs/README.md](docs/README.md)

### Quick Start
1. Clone repository
```bash
git clone https://github.com/user/mmv-clean.git
cd mmv-clean
```

2. Install dependencies
```bash
npm install
```

3. Setup development environment
```bash
# Copy environment config
cp .env.example .env

# Setup git hooks
npx husky install
```

4. Start development
```bash
npm run dev
```

### Development Standards
See [docs/standards/code_style.md](docs/standards/code_style.md)

### Architecture
See [docs/architecture/overview.md](docs/architecture/overview.md)

### Testing
See [docs/standards/testing.md](docs/standards/testing.md)

## Current Development Status

### Active Development
- Resource Management System
- Time Allocation System
- UI Components
- Core Game Loop

### Next Steps
- Skill System Implementation
- Event System
- Save/Load System
- Tutorial System

## License
[MIT](LICENSE)
