import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.querySelector('#root');

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error('Unable to find root element');
}
