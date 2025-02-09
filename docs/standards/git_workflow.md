# Git Workflow Standards

## Branch Strategy

### Main Branches
```
main          - Production code
│
└── develop   - Integration branch
    │
    ├── feature/*    - Feature branches
    ├── bugfix/*     - Bug fixes
    ├── config/*     - Configuration changes
    └── docs/*       - Documentation updates
```

### Branch Naming
```
feature/add-resource-system
feature/implement-time-allocation
bugfix/fix-resource-calculation
config/update-jest-config
docs/add-architecture-docs
```

## Commit Standards

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Test changes
- `chore`: Maintenance tasks

### Examples
```
feat(resources): add resource generation system

- Implement basic resource calculation
- Add rate limiting
- Include resource caps

Closes #123
```

```
fix(time): correct time allocation calculation

Fix incorrect calculation of time efficiency when stress is high.
Previous formula didn't account for diminishing returns.

Fixes #456
```

## Release Management

### Version Tags
```
v1.0.0      - Major release
v1.1.0      - Minor release
v1.1.1      - Patch
v1.0.0-rc.1 - Release candidate
```

### Config Tags
```
config-v1   - Stable configuration
config-v1.1 - Configuration update
```

### Release Process
1. Create release branch
   ```bash
   git checkout -b release/v1.0.0 develop
   ```

2. Version bump
   ```bash
   npm version 1.0.0
   ```

3. Update changelog
   ```bash
   # CHANGELOG.md
   ## [1.0.0] - 2025-02-09
   ### Added
   - Feature 1
   - Feature 2
   ```

4. Merge to main
   ```bash
   git checkout main
   git merge --no-ff release/v1.0.0
   git tag -a v1.0.0 -m "Version 1.0.0"
   ```

5. Back-merge to develop
   ```bash
   git checkout develop
   git merge --no-ff release/v1.0.0
   ```

## Development Workflow

### Starting New Feature
```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Regular commits
git add .
git commit -m "feat(scope): description"

# Push to remote
git push -u origin feature/new-feature
```

### Code Review Process
1. Create Pull Request
   - Use PR template
   - Link related issues
   - Add reviewers

2. Review Checklist
   ```
   □ Follows architecture
   □ Meets standards
   □ Tests included
   □ Documentation updated
   □ No config duplicates
   ```

3. Merge Process
   ```bash
   # Update feature branch
   git checkout feature/new-feature
   git pull origin develop
   
   # Fix conflicts
   git merge develop
   
   # Squash merge to develop
   git checkout develop
   git merge --squash feature/new-feature
   ```

## Configuration Management

### Config Changes
```bash
# Create config branch
git checkout -b config/update-jest

# Make changes
git add jest.config.js
git commit -m "config(jest): update test configuration"

# Tag stable config
git tag -a config-v1.1 -m "Updated Jest configuration"
```

### Backup Policy
```
✓ Use git tags for stable configs
✓ Use branches for experiments
✗ NO backup files (.backup, .old, etc)
✗ NO commented old code
```

## Emergency Fixes

### Hotfix Process
```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix main

# Fix and commit
git commit -m "fix(critical): fix description"

# Merge to main
git checkout main
git merge --no-ff hotfix/critical-fix
git tag -a v1.0.1 -m "Version 1.0.1"

# Back-merge to develop
git checkout develop
git merge --no-ff hotfix/critical-fix
```

## Maintenance

### Clean-up Tasks
```bash
# Remove merged branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Prune remote branches
git remote prune origin

# Clean old backups
find . -name "*.backup" -delete
```

### Recovery Procedures
```bash
# Recover deleted commit
git reflog
git cherry-pick <commit-hash>

# Undo last commit
git reset --soft HEAD~1

# Revert push
git revert <commit-hash>
```