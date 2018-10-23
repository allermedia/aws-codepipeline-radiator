import AWS, { CodePipeline } from 'aws-sdk';
import classNames from 'classnames';
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
    this.fetchApi();
    setInterval(this.fetchApi, 50000);
  }

  public fetchApi = () => {
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
  };

  public render() {
    return (
      <div className="App">
        {this.state.isLoading &&
          !this.state.codePipeline && <img src={logo} className="App-logo" alt="logo" />}
        {this.state.codePipeline && (
          <>
            <h1>{this.state.codePipeline.pipelineName}</h1>
            <ol className="stageStates">
              {this.state.codePipeline.stageStates &&
                this.state.codePipeline.stageStates.map(stageState => {
                  return (
                    <li
                      key={stageState.stageName}
                      className={classNames('stageState', {
                        'stageState--in-progress':
                          stageState.latestExecution &&
                          stageState.latestExecution.status === 'InProgress',
                        'stageState--success':
                          stageState.latestExecution &&
                          stageState.latestExecution.status === 'Succeeded',
                      })}
                    >
                      <h2 className="stageState__name">{stageState.stageName}</h2>
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
