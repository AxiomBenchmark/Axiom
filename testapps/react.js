var React = require('react');
var Component = React.Component;
var ReactDOM = require('react-dom');

window.UUT.isLifecycleTest = false;
window.UUT.isRowsTest = false;

var t0 = 0, t1 = 0;

window.UUT.timing = {
    rend: 0,
    dest: 0,
    mount: 0,
    update: 0
};

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
        if (lifecycleTest) {
            return (<div></div>);
        }
        if (rowsTest) {
            return (<Rows id="Rows" name="Rows" />);
        }
    }
};

// rendering and destroying test
var lifecycleTest = function(callback) {
    window.UUT.isLifecycleTest = true;
    console.log("Running Lifecycle Test")
    for(var i = 0; i < 1000; i++) {
        t0 = performance.now();
        ReactDOM.render(<App/>, document.getElementById('testbench'));
        t1 = performance.now();
        window.UUT.timing.rend += t1 - t0;
    
        t0 = performance.now();
        ReactDOM.unmountComponentAtNode(document.getElementById('testbench'));
        t1 = performance.now();
        window.UUT.timing.dest += t1 - t0;
    }

    var results = {};
    results.test = 'Lifecycle Test'
    results.render = window.UUT.timing.rend/1000
    results.destroy = window.UUT.timing.dest/1000
    results.mount = window.UUT.timing.mount/1000

    window.UUT.isLifecycleTest = false;
    callback(results);
}

var rowsTest = function(callback) {
    window.UUT.isRowsTest = true;
    console.log("Running Rows Test");
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
    window.UUT.isRowsTest = false;
    callback(results);
}

window.UUT.lifecycleTest = lifecycleTest;
window.UUT.rowsTest = rowsTest;
window.UUT.app = App;
console.log(window.UUT);