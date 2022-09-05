import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import esbuildWasm from 'esbuild-wasm';
import "./index.css"
import { store } from './store/store'
import { Provider } from 'react-redux'

esbuildWasm.initialize({
  wasmURL: "https://unpkg.com/esbuild-wasm@0.15.5/esbuild.wasm",
}).then(res=>{
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    // </React.StrictMode>
  );
});
