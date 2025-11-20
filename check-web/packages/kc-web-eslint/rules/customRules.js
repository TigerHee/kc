module.exports = {
  "no-unused-expressions": 0,
  "no-undef": 2,
  "no-underscore-dangle": 0,
  "max-classes-per-file": 0,
  camelcase: 0,
  "no-plusplus": 0,
  "no-console": 0,
  "no-param-reassign": 0,
  "no-restricted-properties": [
    0,
    {
      object: "Math",
    },
  ],
  "consistent-return": 0,
  "global-require": 0,
  "no-nested-ternary": 0,
  "no-restricted-syntax": 0,
  "ui-module/should-no-legacy": 0,
  "ui-module/should-no-destructuring": 2,
  "ui-module/should-no-emotion": 2,
  "react/no-unknown-property": ["error", { ignore: ["css"] }],
  "kupo-lint/no-dangerously-html": 2,
  "kupo-lint/router-path-limit": 2,
  "no-restricted-imports": [
    "error",
    {
      paths: [
        {
          name: "react-redux",
          importNames: ["useSelector"],
          message:
            "Please do not import useSelector from react-redux directly. Use a custom hook from src/hooks/useSelector instead.",
        },
        {
          name: "umi",
          importNames: ["useSelector"],
          message:
            "Please do not import useSelector from umi directly. Use a custom hook from src/hooks/useSelector instead.",
        },
        {
          name: "dva",
          importNames: ["useSelector"],
          message:
            "Please do not import useSelector from dva directly. Use a custom hook from src/hooks/useSelector instead.",
        },
      ],
    },
  ],
  "es-x/no-regexp-lookbehind-assertions": "error", //禁止后行断言
};
