import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "simple-import-sort": simpleImportSort,
            import: importPlugin,
        },
        rules: {
            "import/newline-after-import": ["error", { count: 1 }],
            "import/no-duplicates": ["error", { "prefer-inline": true }],
            "import/first": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^@nestjs", "^@?\\w", "^express"],
                        ["^(@|modules)(/.*|$)"],
                        ["^\\u0000"],
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                    ],
                },
            ],
            "simple-import-sort/exports": ["error"],
            "import/prefer-default-export": "off",
        },
    },
];
