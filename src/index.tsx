import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import esbuildWasm from 'esbuild-wasm';


esbuildWasm.initialize({
  wasmURL: "https://unpkg.com/esbuild-wasm@0.15.5/esbuild.wasm",
}).then(res=>{
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
});
