import React, {Component} from 'react';

function generateDummyTest() {
  var delay = 7000 + Math.random() * 7000;
  var testPassed = Math.random() > 0.5;

  return function(callback) {
    setTimeout(
      function() {
        callback(testPassed);
      },
      delay
    );
  };
}

var tests = [
  {description: 'commas are rotated properly', run: generateDummyTest()},
  {
    description: 'exclamation points stand up straight',
    run: generateDummyTest()
  },
  {description: "run-on sentences don't run forever", run: generateDummyTest()},
  {description: 'question marks curl down, not up', run: generateDummyTest()},
  {
    description: 'semicolons are adequately waterproof',
    run: generateDummyTest()
  },
  {description: 'capital letters can do yoga', run: generateDummyTest()}
];

const testsWithStatus = tests.map(test => ({...test, status: 'not started'}));

class App extends Component {
  constructor() {
    super();
    this.state = {tests: testsWithStatus};
  }
  runTests = () => {
    this.setState(
      {tests: tests.map(test => ({...test, status: 'running'}))},
      () =>
        this.state.tests.forEach(test => {
          test.run(result => {
            const tests = this.state.tests.map(stateTest => {
              if (test !== stateTest) return stateTest;
              return {...test, status: result ? 'passed' : 'failed'};
            });
            this.setState({
              tests
            });
          });
        })
    );
  };
  render() {
    return (
      <div className="App">
        <div className="hero is-primary is-pattern">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-1">Test Runna!</h1>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="container has-text-centered">
            <button className="button is-primary" onClick={this.runTests}>
              Run Tests
            </button>
            <Finished tests={this.state.tests} />
            <Counter tests={this.state.tests} />
            <div>
              {this.state.tests
                .sort((a, b) => a.status < b.status)
                .map(test => <Test key={test.description} test={test} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Finished = ({tests}) => {
  return tests.every(
    test => test.status === 'passed' || test.status === 'failed'
  )
    ? <div className="field">
        <h1 className="title running">FINISHED</h1>
      </div>
    : null;
};

const Counter = ({tests}) => {
  return (
    <div className="field has-text-centered">
      <p>
        <span className="running">
          tests running:
          {tests.filter(test => test.status === 'running').length}
        </span> |
        <span className="passed">
          tests passed: {tests.filter(test => test.status === 'passed').length}
        </span> |
        <span className="failed">
          tests failed: {tests.filter(test => test.status === 'failed').length}
        </span>
      </p>
    </div>
  );
};

const Test = ({test}) => {
  return (
    <div className="">
      <span className={test.status}>
        {test.description} - {test.status}
      </span>
    </div>
  );
};

export default App;
