# Development Policy Enforcement

## Policy Enforcement Checklist

Before proceeding with ANY development task, verify:

1. **Location Check**
```
□ Is this the correct directory for this code?
□ Does it follow the architecture structure?
□ Are we maintaining separation of concerns?
```

2. **Documentation Check**
```
□ Do we have architecture documentation for this?
□ Are we following documented patterns?
□ Do we need to update any documentation?
```

3. **Configuration Check**
```
□ Are we using the correct config files?
□ Are we avoiding duplicate configs?
□ Do config changes need documentation?
```

4. **Testing Check**
```
□ Are tests in the correct location?
□ Are we following test patterns?
□ Do we have the right types of tests?
```

5. **Version Control Check**
```
□ Are we on the correct branch?
□ Are we following commit guidelines?
□ Are we avoiding backup files?
```

## Enforcement Prompt

When working with Claude, use this prompt:

```markdown
I am bound by strict development policies. Before proceeding with any task:

1. Current Context:
   - Review provided files and paths
   - Check existing documentation
   - Verify current architecture

2. Policy Compliance:
   - Location: Must follow directory structure
   - Documentation: Must match or update docs
   - Configuration: No duplicates, follow standards
   - Testing: Correct location and patterns
   - Version Control: No backups, use git

3. Task Execution:
   - Stop if policy violation found
   - Request clarification if unsure
   - Document all decisions
   - Update relevant documentation

I will:
□ Review architecture docs before changes
□ Follow directory structure strictly
□ Prevent configuration duplication
□ Maintain documentation
□ Follow testing patterns
□ Use version control properly

I will not:
× Create backup files
× Duplicate configurations
× Mix concerns
× Skip documentation
× Ignore architecture

The policy exists at /docs/standards/policy_enforcement.md.
Violating these policies is not permitted.
```

## Violation Response

If a policy violation is detected:

1. **Stop Work Immediately**
```
I detect a policy violation:
[Describe specific violation]

We must address this before proceeding.
Options:
1. [Correction action 1]
2. [Correction action 2]
```

2. **Document Issue**
```
This violation occurred because:
- [Root cause]
- [Contributing factors]

To prevent recurrence:
1. [Prevention step 1]
2. [Prevention step 2]
```

3. **Correct Course**
```
Recommended correction:
1. [Step 1]
2. [Step 2]

After correction:
□ Verify policy compliance
□ Update documentation
□ Add preventive measures
```

## Regular Audits

Conduct regular audits:

1. **Directory Structure**
   - Check for correct file locations
   - Verify separation of concerns
   - Clean up any violations

2. **Configuration**
   - Remove duplicate configs
   - Update documentation
   - Verify standards

3. **Documentation**
   - Update architecture docs
   - Verify accuracy
   - Add missing documentation

4. **Version Control**
   - Remove backup files
   - Verify branch structure
   - Update tags