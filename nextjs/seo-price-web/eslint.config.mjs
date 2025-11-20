import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "off", // ⛔️ 关闭 next/image 检查
      "@typescript-eslint/no-explicit-any": "off", // ⛔️ 关闭 any 类型的检查
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "import/no-anonymous-default-export": "off",
      // "react-hooks/exhaustive-deps": "on",
      "prefer-const": "off",
      "react/display-name": "off",
      "no-var": "off",
      "react/no-array-index-key": "off"
    },
  },
];

export default eslintConfig;
