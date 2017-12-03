
var React = require('react');
var ReactDOM = require('react-dom');
var Slider = require('react-slick').default;

// import('./index.css');

class MultipleItems extends React.Component {
  constructor() {
    super()
    this.state = {
      tmax: 0,
      tmin: 100,
      tsum: 0,
      tcnt: 0,
    };

    window.UUT.sliderTest = this.sliderTest.bind(this);
    window.UUT.slider = this.slider.bind(this);
    window.UUT.slider.slickNext = this.slider.slickNext.bind(this);
    // this.sliderTest = this.sliderTest.bind(this);
  }

  next() {
    this.slider.slickNext()
  }

  sliderTest(callback){
    setTimeout(function() {this.setState({
      tmax: 0,
      tmin: 100,
      tsum: 0,
      tcnt: 0,
    }, function() {
    })}.bind(this), 5000);

    this.spamClicks();

    console.log("Running test...");
    var results = {
      'test' : 'Slider Test',
      'max time': this.state.tmax,
      'min time': this.state.tmin,
      'avg time': this.state.tsum / this.state.tcnt
    };
    callback(results);
  }

  
  
  componentDidUpdate() {
    if (this.state.tcnt <= 100){
      this.spamClicks();
    }
    else{
      
        console.log("max: " + this.state.tmax + " ms, avg: " + (this.state.tsum / this.state.tcnt) + " ms, min: " + this.state.tmin + " ms");
        
    }

  }

  spamClicks() {
    // console.log("max: " + this.state.tmax + " ms, avg: " + (this.state.tsum / this.state.tcnt) + " ms, min: " + this.state.tmin + " ms");
    var t0, t1;
    var min = 0, max = 0, sum = 0, cnt = this.state.tcnt;
      t0 = performance.now();
      this.next()
      t1 = performance.now();
      if ((t1 - t0) > this.state.tmax)
        max = (t1 - t0);
      else
        max = this.state.tmax;

      if ((t1 - t0) < this.state.tmin)
        min = (t1 - t0);
      else
        min = this.state.tmin;

      sum = this.state.tsum + (t1 - t0);
      cnt = cnt + 1;
      
      setTimeout(function() {this.setState({
        tmax: max,
        tmin: min,
        tsum: sum,
        tcnt: cnt,
      }, function() {
      })}.bind(this), 0);
  }
    render() {
      const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '60px',
      };
      return (
        <div>
          <div className = 'slider'>
            <Slider  ref={c => this.slider = c }{...settings}>
              <div><h2>1</h2></div>
              <div><h2>2</h2></div>
              <div><h2>3</h2></div>
              <div><h2>4</h2></div>
            </Slider>
          </div>
          <div>
            <StartButton onClickEvent={this.sliderTest}/>
          </div>
        </div>
      );
    }
  }

  class StartButton extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        isClicked: false,
      }
    }

    render() {
      return (
        <div>
          <button className = 'StartButton' onClick={this.props.onClickEvent}>Start</button>
        </div>
      );
        
      }
    }

  // ========================================
  
  ReactDOM.render(
    <MultipleItems />,
    document.getElementById('testbench')
  );