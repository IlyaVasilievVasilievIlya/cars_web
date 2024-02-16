import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App  from './App';

export interface Window {
  [key:string]: any;
}

export const google = (window as Window)['google'];

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
