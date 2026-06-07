import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import mysticdraw from "./eslint-rules/index.js";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      mysticdraw,
    },
    rules: {
      // Custom MysticDraw rules — catch bugs ESLint can't detect
      "mysticdraw/timeout-cleanup": "error",
      "mysticdraw/gsap-cleanup": "warn",
      "mysticdraw/pointer-events-transition": "warn",
      // Strict hooks rules
      "react-hooks/exhaustive-deps": "error",
      // React 19 strict rules — warn only for existing legacy code
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Next.js font rule — we use HTML link tags for static export
      "@next/next/no-page-custom-font": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "eslint-rules/**", // Don't lint the rules themselves
  ]),
]);

export default eslintConfig;
