module.exports = {
  extends: ["react-app", "react-app/jest", "airbnb"],
  plugins: ["simple-import-sort"],
  rules: {
    "import/extensions": "off",
    "jsx-a11y/label-has-associated-control": ["error", {
      required: {
        some: ["nesting", "id"],
      },
    }],
    "jsx-a11y/label-has-for": ["error", {
      required: {
        some: ["nesting", "id"],
      },
    }],
    "max-len": ["error", { code: 119, comments: 99, tabWidth: 2 }],
    "no-underscore-dangle": "off",
    "no-unused-vars": "off",
    quotes: ["error", "double"],
    "react/jsx-filename-extension": [2, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "react/no-unstable-nested-components": "off", // fix
    "react/require-default-props": "off",
    "default-param-last": "off", // fix
    "react/prop-types": "off",
    "simple-import-sort/imports": "error",
    "@typescript-eslint/no-unused-vars": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["./src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
