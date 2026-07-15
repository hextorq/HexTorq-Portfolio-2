import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.tsx';
import './index.css';

export function render() {
  return renderToString(
    <StrictMode>
      <App prerender />
    </StrictMode>,
  );
}
