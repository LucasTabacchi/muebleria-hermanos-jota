module.exports = {
    extends: ["@commitlint/config-conventional"],
    ignores: [
        (message) => message.startsWith("Merge "),
        (message) => message.startsWith("Revert "),
    ],
    rules: {
        "header-max-length": [2, "always", 100],
        "type-enum": [
            2,
            "always",
            ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "build", "ci"],
        ],
    },
};
