module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json',
  },
  extends: [
    'react-app',
    '@react-native-community',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ['react', '@typescript-eslint', 'folders', 'unicorn'],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off", // off, warn, error
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-redeclare': 'warn',
    'react/jsx-props-no-spreading': 'warn',
    'react/prefer-stateless-function': 'warn',
    'react/destructuring-assignment': 'warn',
    'react/require-default-props': 'off',
    'linebreak-style': 'warn',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'import/prefer-default-export': 'warn',
    'no-restricted-syntax': 'warn',
    'no-plusplus': 'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'max-classes-per-file': 'warn',
    'folders/match-regex': ['warn', '^[a-z-]+$', 'src'],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          snakeCase: true,
          pascalCase: true,
        },
        ignore: [
          '^react-app-env.d\\.ts$',
          '^serviceWorker\\.ts$',
          '^setupTests\\.ts$',
        ],
      },
    ],
  },
};
