import AWS, { CodePipeline } from 'aws-sdk';
import * as React from 'react';
import './App.css';

import logo from './logo.svg';

if (process.env.REACT_APP_ACCESS_KEY_ID && process.env.REACT_APP_SECRET_ACCESS_KEY) {
  AWS.config.update({
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    },
    region: process.env.REACT_APP_REGION,
  });
} else {
  console.error('Add REACT_APP_ACCESS_KEY_ID and REACT_APP_SECRET_ACCESS_KEY to .env');
}

class App extends React.Component {
  public componentDidMount() {
    if (process.env.REACT_APP_CODE_PIPELINE_NAME) {
      new CodePipeline().getPipelineState(
        { name: process.env.REACT_APP_CODE_PIPELINE_NAME },
        (error, data) => {
          if (error) {
            console.log(error, error.stack);
          } else {
            console.log(data);
          }
        },
      );
    } else {
      console.error('Add REACT_APP_CODE_PIPELINE_NAME to .env');
    }
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
