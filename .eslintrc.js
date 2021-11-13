module.exports = {
  extends: ["react-app", "react-app/jest", "airbnb"],
  plugins: ["simple-import-sort"],
  rules: {
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
    "max-len": ["error", { code: 100, comments: 100, tabWidth: 2 }],
    "no-underscore-dangle": "off",
    quotes: ["error", "double"],
    "react/prop-types": "off",
    "simple-import-sort/imports": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["./src"],
        extensions: [".js", ".jsx"],
      },
    },
  },
};
