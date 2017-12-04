var React = require('react');
var Component = React.Component;
var ReactDOM = require('react-dom');
// import './index.css';
var t0 = 0, t1 = 0;

var timing = {
    rend: 0,
    dest: 0,
    mount: 0,
    update: 0
};

var results = {};

class Buttons extends Component {
    constructor(props) {
        super(props);
        this.state = {count: 1};
    }
    
    componentDidMount() {
        t1 = performance.now();
        timing.mount += t1 - t0;
    }
    
    componentDidUpdate() {
        t1 = performance.now();
        timing.update += t1 - t0;
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        t0 = performance.now();
        if (this.props.color !== nextProps.color) {
        return true;
        }
        if (this.state.count !== nextState.count) {
        return true;
        }
        return false;
    }
    
    clicky() {
        this.setState({count: this.state.count + 1})
    }
    
    clickTest() {
        
    }
    
    render() {
        t0 = performance.now();
        return (
        <button
            color={this.props.color}
            onClick={this.clicky.bind(this)}>
            Count: {this.state.count}
        </button>
        );
    }
}

class App extends Component {
    render() {  
        return (
            <div>
                {/* <h1>Lifecycle Rendering and Destroying Test</h1>
                <div>
                    Average Render Time {timing.rend/1000} ms
                </div>
                <div>
                    Average Destroy Time {timing.dest/1000} ms
                </div>
                <div>
                    Average Mount Time {timing.mount/1000} ms
                </div>
                <div>
                    Average Update Time {timing.update} ms
                </div> */}
                <Buttons id="Button" /*ref={this.simulateClick}*/ name="Buttons" />
            </div>
        );
    }
};

// rendering and destroying test
var testA = function(callback) {
    console.log("Running Test A")
    for(var i = 0; i < 1000; i++) {
        t0 = performance.now();
        ReactDOM.render(<App/>, document.getElementById('testbench'));
        t1 = performance.now();
        timing.rend += t1 - t0;
    
        t0 = performance.now();
        ReactDOM.unmountComponentAtNode(document.getElementById('testbench'));
        t1 = performance.now();
        timing.dest += t1 - t0;
    }

    results = {};
    results.test = 'Lifecycle Test A'
    results.render = timing.rend/1000
    results.destroy = timing.dest/1000
    results.mount = timing.mount/1000

    // rerender the app
    // ReactDOM.render(<App/>, document.getElementById('testbench'));
    callback(results);
}

// updating test
var testB = function(callback) {
    
    console.log("Running Test B")
    var b = document.getElementById('root');
    
    // click the button 1000 times
    for(var i = 0; i < 100; i++) {
        console.log(b)
    }

    results = {};
    results.test = 'Lifecycle Test B'
    results.update = timing.update
    callback(results);
}

window.UUT.lifecycleTestA = testA;
window.UUT.lifecycleTestB = testB;
window.UUT.app = App;
console.log(window.UUT);