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

interface State {
  codePipeline?: CodePipeline.GetPipelineStateOutput;
  isLoading: boolean;
}

class App extends React.Component<{}, State> {
  public state: Readonly<State> = { isLoading: false };
  public componentDidMount() {
    if (process.env.REACT_APP_CODE_PIPELINE_NAME) {
      this.setState({ isLoading: true });
      new CodePipeline().getPipelineState(
        { name: process.env.REACT_APP_CODE_PIPELINE_NAME },
        (error, data) => {
          if (error) {
            this.setState({ isLoading: false });
            console.log(error, error.stack);
          } else {
            console.log(data.stageStates);
            this.setState({ codePipeline: data, isLoading: false });
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
        {this.state.isLoading && <p>Loading</p>}
        {this.state.codePipeline && (
          <>
            <p className="App-intro">{this.state.codePipeline.pipelineName}</p>
            <ol className="stageStates">
              {this.state.codePipeline.stageStates &&
                this.state.codePipeline.stageStates.map(stageState => {
                  return (
                    <li key={stageState.stageName}>
                      {stageState.stageName} -{' '}
                      {stageState.latestExecution && stageState.latestExecution.status}
                      <ol className="actionStates">
                        {stageState.actionStates &&
                          stageState.actionStates.map(actionState => {
                            return (
                              <li key={actionState.actionName}>
                                {actionState.actionName} -{' '}
                                {actionState.latestExecution && actionState.latestExecution.status}
                              </li>
                            );
                          })}
                      </ol>
                    </li>
                  );
                })}
            </ol>
          </>
        )}
      </div>
    );
  }
}

export default App;
