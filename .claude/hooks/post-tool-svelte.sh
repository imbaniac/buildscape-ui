#!/bin/bash

# Exit on error
set -e

# Get the file path from Claude Code environment
FILE_PATH="${CLAUDE_PARAM_file_path}"

# Check if file was edited
if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only process Svelte, TypeScript, and JavaScript files
if [[ ! "$FILE_PATH" =~ \.(svelte|ts|js|tsx|jsx)$ ]]; then
    exit 0
fi

# Navigate to project directory
cd "$CLAUDE_PROJECT_DIR"

# Check if the file exists
if [ ! -f "$FILE_PATH" ]; then
    exit 0
fi

# Run svelte-check for Svelte files
if [[ "$FILE_PATH" =~ \.svelte$ ]]; then
    echo "Running svelte-check on $FILE_PATH..."
    # Run svelte-check only on the specific file to be faster
    npx svelte-check --tsconfig ./tsconfig.json --diagnostic-sources "$FILE_PATH" --output human || true
fi

# Format with prettier if available
if command -v npx &> /dev/null && npx prettier --version &> /dev/null 2>&1; then
    echo "Formatting $FILE_PATH with prettier..."
    npx prettier --write "$FILE_PATH" || true
fi

exit 0