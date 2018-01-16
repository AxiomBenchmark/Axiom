var React = require('react');
var ReactDOM = require('react-dom');

var startTime;
var lastMeasure;
var t0;
var timing =  {
    create: 0,
    update: 0,
    swap: 0
};
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            t0 = stop - startTime;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

const _random = (max) => {
    return Math.round(Math.random() * 1000) % max;
}
const updateData = (data, mod = 10) => {
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 10) {
        newData[i] = Object.assign({}, newData[i], { label: newData[i].label + ' !!!' });
    }
    return newData;
}
export const buildData = (id, count = 1000) => {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++)
        data.push({ id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return { data, id };
}

export const createRow = (id) => {
    return buildData(id);
}

export const update = (data) => {
    return updateData(data);
}

export const swapRows = (data) => {
    const newData = [...data];
    if (newData.length > 998) {
        let temp = newData[1];
        newData[1] = newData[998];
        newData[998] = temp;
    }
    return newData;
}


class Rows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected: undefined,
            id: 1
        };
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.swapRows = this.swapRows.bind(this);
        this.start = 0;
    }
    printDuration() {
        stopMeasure();
    }
    componentDidUpdate() {
        this.printDuration();
    }
    componentDidMount() {
        this.printDuration();
    }
    create() {
        startMeasure("createRows");
        const { id } = this.state;
        const obj = createRow(id);
        this.setState({ data: obj.data, id: obj.id, selected: undefined });
    }
    /* updates every tenth row */
    update() {
        startMeasure("update");
        const data = update(this.state.data);
        this.setState({ data: data });
    }

    swapRows() {
        startMeasure("swapRows");
        const data = swapRows(this.state.data);
        this.setState({ data: data });
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
            <table className="table">
                <tbody> {rows} </tbody>
            </table>
        </div>);
    }
    
}

var testCreate = function(callback) {
    console.log("Running creation test");
    Rows.create();
    ReactDOM.render(<Rows/>, document.getElementById('testbench'));
    stopMeasure();
    results = {};
    results.test = 'Create Row';
    results.time = t0 / 1000;
    callback(results);
}


var testSwap = function(callback) {
    console.log("Running swap test");
    Rows.swapRows();
    ReactDOM.render(<Rows/>, document.getElementById('testbench'));
    stopMeasure();
    results = {};
    results.test = 'Swap Rows';
    results.time = t0 / 1000;
    callback(results);
}

var testUpdate = function(callback) {
    console.log("Runnig update test");
    Rows.update();
    ReactDOM.render(<Rows/>, document.getElementById('testbench'));
    stopMeasure();
    results = {};
    results.test = 'Partial Update Rows';
    results.time = t0 / 1000;
    callback(results);
}



