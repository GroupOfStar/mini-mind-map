import { defineConfig } from "rollup";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      format: "cjs",
      file: pkg.main
    },
    {
      format: "esm",
      file: pkg.module
    }
  ],
  plugins: [json(), typescript(), nodeResolve()]
});
