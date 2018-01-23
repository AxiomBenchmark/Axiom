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


class Rows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            id: 1
        };
        this.add = this.add.bind(this);
        this.update = this.update.bind(this);
        this.swapRows = this.swapRows.bind(this);
    }
    printDuration() {
        t1 = performance.now();
    }
    componentDidUpdate() {
        this.printDuration();
    }
    componentDidMount() {
        this.printDuration();
    }
    random(max) {
        return Math.round(Math.random() * 1000) % max;
    }
    add() {
        t0 = performance.now();
        const { id } = this.state;
        var count = 1000;
        var adjectives = ["pretty", "large", "big", "small", "tall", "short", 
        "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", 
        "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", 
        "important", "inexpensive", "cheap", "expensive", "fancy"];
        var colours = ["red", "yellow", "blue", "green", "pink", "brown", 
        "purple", "brown", "white", "black", "orange"];
        var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", 
        "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
        var items = [];
        for (var i = 0; i < count; i++) {
            items.push({ id: id++, 
                label: adjectives[this.random(adjectives.length)] + " " + colours[this.random(colours.length)] + " " + nouns[this.random(nouns.length)] });
        }
        const obj = { items, id };
        this.setState({ data: obj.data, id: obj.id });
    }
    /* updates every tenth row */
    update() {
        t0 = performance.now();
        mod = 10;
        const newData = [...this.state.data];
        for (let i = 0; i < newData.length; i += 10) {
            newData[i] = Object.assign({}, newData[i], 
            { label: newData[i].label + ' !!!' });
        }
        this.setState({ data: newData });
    }

    swapRows() {
        t0 = performance.now();
        const newData = [...this.state.data];
        if (newData.length > 998) {
            let temp = newData[1];
            newData[1] = newData[998];
            newData[998] = temp;
        }
        this.setState({ data: newData });
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, selected } = this.state;
        const nextData = nextState.data;
        const nextSelected = nextState.selected;
        return !(data.length === nextData.length 
            && data.every((v, i) => v === nextData[i])) || selected != nextSelected;
    }

    render() {
        let rows = this.state.data.map((d, i) => {
            return <Row key={d.id} data={d}></Row>
        });
        return (<div className="container" id="textTable">
            <div className="col-md-6">
                <div className="row">
                    <div className="col-sm-6 smallpad">
                        <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Create Rows</button>
                    </div>
                    <div className="col-sm-6 smallpad">
                        <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update Rows</button>
                    </div>
                    <div className="col-sm-6 smallpad">
                        <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows}>Swap Rows</button>
                    </div>
                </div>
            </div>
            <table className="table">
                <tbody>{rows}</tbody>
            </table>
        </div>);
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
                <Rows id="Rows" name="Rows" />
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


var testRows = function(callback) {
    console.log("Running creation test");
    results = {};
    results.test = 'Rows Test';
    var a = document.getElementById('add');
    console.log(a);
    ReactDOM.render(<Rows/>, document.getElementById('testbench'));
    t1 = performance.now();
    results.create = (t1 - t0) / 1000;
    a = document.getElementById('update');
    console.log(a);
    ReactDOM.render(<Rows/>, document.getElementById('testbench'));
    t1 = performance.now();
    results.update = (t1 - t0) / 1000;
    a  = document.getElementById('swaprows');
    console.log(a);
    t1 = performance.now();
    results.swap = (t1 - t0) / 1000;
    ReactDOM.unmountComponentAtNode(document.getElementById('testbench'));
    callback(results);
}

window.UUT.lifecycleTestA = testA;
window.UUT.lifecycleTestB = testB;
window.UUT.testRows = testRows;
window.UUT.app = App;
console.log(window.UUT);