// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},  // Add empty recommendedConfig object
  allConfig: {},          // Add empty allConfig object
});

// Create a simple config without the problematic extensions
const eslintConfig = [
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    ...compat.extends("next/core-web-vitals")
  }
];

export default eslintConfig;