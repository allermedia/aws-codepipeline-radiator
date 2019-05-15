import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const isEnvFileCorrect =
  !!process.env.REACT_APP_ACCESS_KEY_ID &&
  !!process.env.REACT_APP_SECRET_ACCESS_KEY &&
  !!process.env.REACT_APP_REGION &&
  !!process.env.REACT_APP_CODE_PIPELINE_NAMES;

ReactDOM.render(<App isEnvFileCorrect={isEnvFileCorrect} />, document.getElementById(
  'root',
) as HTMLElement);
registerServiceWorker();
