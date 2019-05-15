import AWS, { CodePipeline } from 'aws-sdk';
import classNames from 'classnames';
import * as React from 'react';
import './App.css';

import bug from './bug.svg';
import logo from './logo.svg';

type Props = {
  isEnvFileCorrect: boolean;
};

type State = {
  codePipelines?: CodePipeline.GetPipelineStateOutput[];
  isLoading: boolean;
  showEnvFileError: boolean;
};

class App extends React.Component<Props, State> {
  public state: Readonly<State> = { isLoading: false, showEnvFileError: false };
  public componentDidMount() {
    if (this.props.isEnvFileCorrect) {
      AWS.config.update({
        credentials: {
          accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID!,
          secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY!,
        },
        region: process.env.REACT_APP_REGION,
      });
      this.fetchApi();
      setInterval(this.fetchApi, 5000);
    } else {
      this.setState({ showEnvFileError: true });
    }
  }

  public pipelinePromise = (name: string) => {
    return new Promise<CodePipeline.GetPipelineStateOutput>((resolve, reject) => {
      new CodePipeline().getPipelineState({ name }, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  };

  public fetchApi = () => {
    this.setState({ isLoading: true });
    Promise.all(process.env.REACT_APP_CODE_PIPELINE_NAMES!.split(',').map(this.pipelinePromise))
      .then(data => {
        this.setState({ isLoading: false, codePipelines: data });
      })
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false });
      });
  };

  public render() {
    if (this.state.showEnvFileError) {
      return (
        <>Your .env file is not correct. Please check README to see how it should be configured</>
      );
    }

    return (
      <div className="app">
        {this.state.isLoading && !this.state.codePipelines && (
          <div className="loading">
            <img src={logo} className="App-logo" alt="logo" />
            <h3>Loading</h3>
          </div>
        )}
        {this.state.codePipelines &&
          this.state.codePipelines.map(codePipeline => {
            return (
              <div key={codePipeline.pipelineName} className="codePipeline">
                <h2 className="codePipeline__name">{codePipeline.pipelineName}</h2>
                <ol className="stageStates">
                  {codePipeline.stageStates &&
                    codePipeline.stageStates.map((stageState, index) => {
                      return (
                        <li
                          key={stageState.stageName}
                          className={classNames('stageState', {
                            'stageState--error':
                              stageState.latestExecution &&
                              stageState.latestExecution.status === 'Failed',
                            'stageState--in-progress':
                              stageState.latestExecution &&
                              stageState.latestExecution.status === 'InProgress',
                            'stageState--success':
                              stageState.latestExecution &&
                              stageState.latestExecution.status === 'Succeeded',
                          })}
                        >
                          <h3 className="stageState__name">
                            {index + 1}. {stageState.stageName}
                          </h3>
                          {stageState.latestExecution &&
                            stageState.latestExecution.status === 'InProgress' && (
                              <div className="in-progress-icon" />
                            )}
                          {stageState.latestExecution &&
                            stageState.latestExecution.status === 'Failed' && (
                              <img src={bug} alt="logo" className="error-icon" />
                            )}
                          <ol className="actionStates">
                            {stageState.actionStates &&
                              stageState.actionStates.map(actionState => {
                                return (
                                  <li
                                    key={actionState.actionName}
                                    className={classNames('actionState', {
                                      'actionState--error':
                                        actionState.latestExecution &&
                                        actionState.latestExecution.status === 'Failed',
                                      'actionState--in-progress':
                                        actionState.latestExecution &&
                                        actionState.latestExecution.status === 'InProgress',
                                      'actionState--success':
                                        actionState.latestExecution &&
                                        actionState.latestExecution.status === 'Succeeded',
                                    })}
                                  >
                                    {actionState.actionName}
                                    {actionState.latestExecution &&
                                      actionState.latestExecution.status === 'Failed' && (
                                        <>
                                          <div className="actionState__error-description">
                                            {actionState.latestExecution.summary}
                                          </div>
                                          {actionState.latestExecution.lastUpdatedBy && (
                                            <div className="actionState__error-written-by">
                                              {actionState.latestExecution.lastUpdatedBy
                                                .split('/')
                                                .pop()}
                                            </div>
                                          )}
                                        </>
                                      )}
                                  </li>
                                );
                              })}
                          </ol>
                        </li>
                      );
                    })}
                </ol>
              </div>
            );
          })}
      </div>
    );
  }
}

export default App;
