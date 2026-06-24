import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // n8n/ contient du code destiné aux nœuds n8n (globals $input, return racine) :
  // hors périmètre du lint du front.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "n8n/**"]),
]);

export default eslintConfig;
