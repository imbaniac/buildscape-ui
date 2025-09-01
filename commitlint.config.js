export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, missing semicolons, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Test changes
        "build", // Build system or dependencies
        "ci", // CI configuration changes
        "chore", // Other changes that don't modify src or test files
        "revert", // Revert a previous commit
        "wip"
      ],
    ],
    // No scope enforcement - use any scope or no scope at all
    "scope-enum": [0],
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
  },
};