import esbuildWasm from "esbuild-wasm";
import { resolve } from "../plugins/resolve";
import { load } from "../plugins/load";
const data = async (input:string) => await esbuildWasm.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    define: {
      "process.env.NODE_ENV": '"development"',
      global: "window",
    },
    // plugins: [unpkgPathPlugin(input)]
    plugins: [resolve(), load(input)],
});

export default data;