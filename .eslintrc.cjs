module.exports = {
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    }
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint", "unused-imports"],
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  globals: {
    jest: true
  },
  ignorePatterns: [".cjs", "*.mjs", "*.js", "**/*.graphql", "**/*.mustache", "**/*.md", "*.bak"],
  rules: {
    "comma-dangle": 0,
    "no-useless-escape": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "no-undef": 0,
    "no-useless-return": 0,
    "default-case": 0,
    "no-underscore-dangle": 0,
    "no-restricted-globals": 0,
    "no-return-await": 0,
    "object-curly-newline": 0,
    "no-return-assign": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "import/no-extraneous-dependencies": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-useless-constructor": 0,
    "@typescript-eslint/no-var-requires": 0,
    "import/no-cycle": 0,
    "operator-linebreak": 0,
    "no-confusing-arrow": 0,
    "no-shadow": 0,
    "arrow-parens": 0,
    "function-paren-newline": 0,
    "import/no-unresolved": "error",
    "no-use-before-define": 0,
    "import/order": 0,
    "implicit-arrow-linebreak": 0,
    "import/prefer-default-export": 0,
    "arrow-body-style": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "dot-notation": 1,
    "class-methods-use-this": 0,
    "func-names": 0,
    "no-restricted-syntax": 0,
    "max-classes-per-file": 0,
    "no-console": 0,
    "linebreak-style": 0,
    "eol-last": 0,
    "max-len": 0,
    "import/extensions": [
      2,
      "ignorePackages",
      {
        ts: "never",
        tsx: "never"
      }
    ],
    "no-unreachable": 0,
    "no-empty": 0,
    "no-nested-ternary": 0,
    "no-unsafe-finally": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/ban-types": 0,
    "dot-notation": 0,
    "@typescript-eslint/dot-notation": 0,
    "@typescript-eslint/no-shadow": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "no-tabs": 0,
    "no-plusplus": 0,
    "@typescript-eslint/return-await": 0,
    "no-await-in-loop": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "off",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
    ]
  }
};
