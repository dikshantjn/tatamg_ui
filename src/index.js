import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { analytics } from './firebase/config';
import { logEvent } from 'firebase/analytics';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals((metric) => {
  try {
    if (!analytics) return;
    const value = metric.name === 'CLS' ? metric.value * 1000 : metric.value;
    logEvent(analytics, 'web_vitals', {
      metric_name: metric.name,
      metric_id: metric.id,
      metric_value: Math.round(value),
      metric_label: metric.label
    });
  } catch (e) {
    // swallow
  }
});
