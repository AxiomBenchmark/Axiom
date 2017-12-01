var React = require('react');
var ReactDOM = require('react-dom');

class Thing extends React.Component {
  constructor() {
    super();
    this.state = {
      'name' : 'Dave'
    };

    window.UUT.testA = this.testA.bind(this);
  }
  
  render() {
    return (<div>Hey {this.state.name}</div>);
  }

  testA(callback) {
    console.log('test A STARTED RIGHT HERE!!!!!!!');
    this.setState({
      'name': 'Joe'
    });
    var results = {
      'result' : 'THIS IS OUR RESULT'
    };
    callback(results);
  }
}

ReactDOM.render(
    <Thing/>,
    document.getElementById('testbench')
  );