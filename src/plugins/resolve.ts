import * as esbuild from "esbuild-wasm";

export const resolve = () => {
  return {
    name: "unpkg-path-plugin-resolve",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /index\.js/ }, async (args: any) => {
        // console.log("onResolve", args);
        return { path: args.path, namespace: "a" };
      });
    build.onResolve({ filter: /^\./ }, async (args: any) => {
        // console.log("onResolve", args);
        const url = new URL(args.path, args.resolveDir.substring(1) + "/");
        return { path: url.href, namespace: "a" };

      });
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // console.log("onResolve", args);
        const url = new URL(args.path, "https://unpkg.com/");
        return { path: url.href, namespace: "a" };
      });
    },
  };
};
