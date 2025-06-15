# Comprehensive Code Review Request

**Usage**: `/review $FILE_OR_PR`

## Review Instructions

Perform a deep code analysis following these specific requirements:

### 1. Issue Categorization System

Use this severity classification for ALL findings:

- **🔴 CRITICAL** - Bugs, security vulnerabilities, data loss risks, system crashes
- **🟡 MAJOR** - Significant logic errors, performance bottlenecks, maintainability concerns
- **🔵 MINOR** - Potential edge cases, minor inefficiencies, style inconsistencies
- **🟢 SUGGESTION** - Best practices, optimizations, refactoring opportunities

### 2. Analysis Scope

For Rust:
- Ownership and borrowing violations (lifetime errors, unnecessary clones, dangling references)
- Concurrency issues (data races via `unsafe`, improper use of `Arc<Mutex>`/`RwLock`, deadlocks, starvation)
- Unsafe code usage and other memory-safety violations
- Error handling problems (`unwrap`/`expect` in production code, improper propagation of `Result`, error type design)
- Performance bottlenecks (unnecessary allocations, algorithmic inefficiencies, cache misses)
- Async/await pitfalls (blocking in async context, task starvation, `.await` inside tight loops)
- Resource leaks (`tokio` tasks, file handles, socket connections, `Rc` reference cycles)
- Security vulnerabilities (command injection, path traversal, FFI unsafety, integer overflows)
- Non-idiomatic Rust patterns (incorrect trait bounds, missing derives, ignored clippy lints)
- Insufficient or missing tests, benchmarks, and documentation

### 3. Review Output Format

Create a structured review plan using this template:

```markdown
# Code Review Plan - [Project/PR Name]

## Executive Summary
- Total Issues Found: [X Critical, Y Major, Z Minor, W Suggestions]
- Overall Risk Assessment: [Critical/High/Medium/Low]
- Estimated Fix Time: [X hours]

## Critical Issues 🔴
### Issue #1: [Issue Title]
- **File**: `path/to/file.rs` (lines X-Y)
- **Description**: [Detailed explanation of the issue]
- **Impact**: [What could go wrong if not fixed]
- **Root Cause**: [Why this happened]
- **Fix Required**:
  ---
  // Current problematic code

  // Fixed code
  ---

## Major Issues 🟡
[Same format as above]

## Minor Issues 🔵
[Same format as above]

## Suggestions 🟢
[Same format as above]

## Fix Tracking Checklist
- [ ] 🔴 [Critical Issue 1 Title] - `file.rs:45`
- [ ] 🔴 [Critical Issue 2 Title] - `file.rs:23`
- [ ] 🟡 [Major Issue 1 Title] - `component.rs:67`
- [ ] 🔵 [Minor Issue 1 Title] - `utils.rs:12`
- [ ] 🟢 [Suggestion 1 Title] - `api.rs:89`

## Files Modified
1. `path/to/file1.rs` - [Brief description of changes needed]
2. `path/to/file2.rs` - [Brief description of changes needed]

## Implementation Priority
1. **Immediate** (Block deployment): All 🔴 Critical issues
2. **Before Merge**: All 🟡 Major issues
3. **Next Sprint**: 🔵 Minor issues
4. **Tech Debt Backlog**: 🟢 Suggestions
```

### 4. Review Process

1. **First Pass**: Identify all issues and categorize by severity
2. **Root Cause Analysis**: For each 🔴 and 🟡 issue, explain why it occurred
3. **Fix Generation**: Provide exact code fixes for all 🔴 and 🟡 issues
4. **Verification Plan**: Suggest tests to verify each fix

### 5. Special Focus Areas

- **Security**: Run through OWASP Top 10 checklist
- **Memory Safety**: Verify all `unsafe` blocks uphold Rust's guarantees and avoid undefined behavior
- **Performance**: Check for O(n²) algorithms, unnecessary allocations or database calls
- **Concurrency**: Ensure proper synchronization (e.g., `Send`/`Sync` bounds, lock contention, deadlocks)
- **Error Handling**: Ensure no errors are silently ignored and proper `Result` propagation
- **Testing**: Identify untested edge cases

### 6. Fix Implementation Workflow

When implementing fixes:
1. Start with all 🔴 Critical issues in order
2. Update the checklist as each item is completed
3. Add the modified files list with actual changes made
4. Re-run analysis to ensure no new issues introduced

## Additional Requirements

- Assume production environment with high traffic
- Consider both immediate bugs and long-term maintainability
- Provide time estimates for fixing each issue category
- Include code examples for all proposed fixes
- Flag any architectural concerns that require team discussion

## Tracking
Write this into a markdown file in the `review` folder.
If the folder is missing, create it.
If the file already exists, update it.
The file name should be the same as the file or PR name, with the extension `.md`.

Begin the review now and output the complete plan following the template above.