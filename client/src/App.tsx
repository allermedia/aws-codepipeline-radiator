import { CodePipeline } from 'aws-sdk';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import './App.css';
import axios from 'axios';

import bug from './bug.svg';
import logo from './logo.svg';

type Props = {
};

type State = {
  codePipelines?: CodePipeline.GetPipelineStateOutput[];
  isLoading: boolean;
  showEnvFileError: boolean;
};

class App extends React.Component<Props, State> {
  public state: Readonly<State> = { isLoading: false, showEnvFileError: false };

  public componentDidMount(): void {
    this.fetchApi();
    setInterval(this.fetchApi, 5000);
  }

  public fetchApi = (): void => {
    this.setState({ isLoading: true });

    const queryParam = new URLSearchParams(window.location.search).get('q');
    if (queryParam) {
      axios.get(`/api/codepipelines/state?q=${queryParam}`)
        .then((res) => {
          this.setState({
            isLoading: false,
            codePipelines: res.data as CodePipeline.GetPipelineStateOutput[],
          });
        })
        .catch((err) => {
          console.error('Error:', err);
          this.setState({ isLoading: false });
        });
    }
  };

  public render(): ReactNode {
    return (
      <div className="app">
        {this.state.isLoading && !this.state.codePipelines && (
          <div className="loading">
            <img src={logo} className="App-logo" alt="logo" />
            <h3>Loading</h3>
          </div>
        )}
        {this.state.codePipelines
          && this.state.codePipelines.map((codePipeline) => (
              <div key={codePipeline.pipelineName} className="codePipeline">
                <h2 className="codePipeline__name">{codePipeline.pipelineName}</h2>
                <ol className="stageStates">
                  {codePipeline.stageStates
                    && codePipeline.stageStates.map((stageState, index) => (
                        <li
                          key={stageState.stageName}
                          className={classNames('stageState', {
                            'stageState--error':
                              stageState.latestExecution
                              && stageState.latestExecution.status === 'Failed',
                            'stageState--in-progress':
                              stageState.latestExecution
                              && stageState.latestExecution.status === 'InProgress',
                            'stageState--success':
                              stageState.latestExecution
                              && stageState.latestExecution.status === 'Succeeded',
                          })}
                        >
                          <h3 className="stageState__name">
                            {index + 1}. {stageState.stageName}
                          </h3>
                          {stageState.latestExecution
                            && stageState.latestExecution.status === 'InProgress' && (
                              <div className="in-progress-icon" />
                          )}
                          {stageState.latestExecution
                            && stageState.latestExecution.status === 'Failed' && (
                              <img src={bug} alt="logo" className="error-icon" />
                          )}
                          <ol className="actionStates">
                            {stageState.actionStates
                              && stageState.actionStates.map((actionState) => (
                                  <li
                                    key={actionState.actionName}
                                    className={classNames('actionState', {
                                      'actionState--error':
                                        actionState.latestExecution
                                        && actionState.latestExecution.status === 'Failed',
                                      'actionState--in-progress':
                                        actionState.latestExecution
                                        && actionState.latestExecution.status === 'InProgress',
                                      'actionState--success':
                                        actionState.latestExecution
                                        && actionState.latestExecution.status === 'Succeeded',
                                    })}
                                  >
                                    {actionState.actionName}
                                    {actionState.latestExecution
                                      && actionState.latestExecution.status === 'Failed' && (
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
                              ))}
                          </ol>
                        </li>
                    ))}
                </ol>
              </div>
          ))}
      </div>
    );
  }
}

export default App;
