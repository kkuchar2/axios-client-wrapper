import babel from "@rollup/plugin-babel";
import commonjs from '@rollup/plugin-commonjs';
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const EXTENSIONS = [".ts", ".tsx"];

const EXTERNAL = Object.keys(pkg.devDependencies);

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true })
  ],
  external: EXTERNAL
};