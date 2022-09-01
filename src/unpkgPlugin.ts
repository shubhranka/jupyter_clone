import * as esbuild from 'esbuild-wasm';
import localforage from 'localforage';

const cacheInstance:any = localforage.createInstance({
  name: 'unpkgPlugin',
});

// Make cacheInstance available to global scope
(window as any).localForageCacheInstance = cacheInstance;
export const unpkgPathPlugin = (input:string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // console.log('onResole', args);
        
        if(args.path === "index.js") {
          return { path: args.path, namespace: 'a' };
        }
        else{
          if(!args.path.startsWith(".")){
            const url = new URL(args.path, "https://unpkg.com/");
            return { path:url.href , namespace: 'a'};
          }else {
            const url = new URL(args.path,args.resolveDir.substring(1)+"/")
            return { path: url.href, namespace: 'a'};
          }
        }

      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `${input}`,
            resolveDir: '.',
          };
        } else {
          const key = args.path;
          const myResult = await cacheInstance.getItem(key);
          // console.log(myResult)
          if (myResult) {
            return myResult;
          }
          const data:any = await fetch(args.path);
          const ind = data.url.lastIndexOf("/");
          const redirectedURL = data.url.substring(0, ind)

          const fileType = args.path.endsWith('css') ? 'css' : 'jsx';
          // const redirectedURL = new URL("./",data.url)
          let dataContent = await data.text();
          if(fileType === 'css')
          dataContent = dataContent
          .replace(/\n/g, ' ')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

          const contents = fileType === 'css' ? `
            const style = document.createElement('style');
            style.innerHTML = "${dataContent}";
            document.head.appendChild(style);
          ` : dataContent;

          const result: esbuild.OnLoadResult = {
            loader:"jsx",
            contents,
            resolveDir: redirectedURL,
          };
          await cacheInstance.setItem(key, result);
          return result;
        }
      });
    },
  };
};