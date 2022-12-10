import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const cacheInstance: any = localforage.createInstance({
  name: "unpkgPlugin",
});

// Make cacheInstance available to global scope
(window as any).localForageCacheInstance = cacheInstance;

export const load = (input: string) => {
  return {
    name: "unpkg-path-plugin-load",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /index.js/ }, async (args: any) => {
        // console.log('onLoad', args);
        return {
          loader: "jsx",
          contents: `${input}`,
          resolveDir: ".",
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // console.log('onLoad', args);
        const key = args.path;
        const myResult = await cacheInstance.getItem(key);
        // console.log(myResult)
        if (myResult) {
          return myResult;
        }
        const data: any = await fetch(args.path);
        const ind = data.url.lastIndexOf("/");
        const redirectedURL = data.url.substring(0, ind);
        const fileType = args.path.endsWith("css") ? "css" : "jsx";
        let dataContent = await data.text();
        if (fileType === "css")
          dataContent = dataContent
            .replace(/\n/g, " ")
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");

        const contents =
          fileType === "css"
            ?   `
                const style = document.createElement('style');
                style.innerHTML = "${dataContent}";
                document.head.appendChild(style);
                `
            : dataContent;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: redirectedURL,
        };
        await cacheInstance.setItem(key, result);
        return result;
      });
    },
  };
};
