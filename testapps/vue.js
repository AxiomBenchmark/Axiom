var Vue = require('vue');

var t0 = 0, t1 = 0, t2 = 0;

var timing = {
  rend: 0,
  dest: 0,
  mount: 0,
  update: 0
};

var results = {};

var vm = function() {
  return new Vue({
    el: '#testbench',
    data: {
      message: 'Hello Vue.js!'
    },
    beforeCreate: function() {
      //console.log("before created!")
    },
    created: function() {
      //console.log("created!")
      t1 = performance.now()
    },
    beforeMount: function() {
      //console.log("before mounted!")
    },
    mounted: function() {
      //console.log("mounted!")
      t2 = performance.now()
    },
    beforeUpdate: function() {
      ////consolelog("before updated!")
    },
    updated: function() {
      ////consolelog("updated!")
    },
    beforeDestroy: function() {
      //consolelog("before destroyed!")
    },
    destroyed: function() {
      //consolelog("destroyed!")
      t1 = performance.now()
    },
    activated: function() {
      //consolelog("activated!")
    },
    deactivated: function() {
      //consolelog("deactivated!")
    },
  });
}

// render and destroy test
var testA = function(callback) {
  // var v = vm();

  for(var i = 0; i < 1000; i++) {
    t0 = performance.now()
    let v = vm();
    timing.rend += t1 - t0
    timing.mount += t2 - t0

    t0 = performance.now()
    v.$destroy();
    timing.dest += t1 - t0
  }
  
  //consolelog("boo")
  results = {};
  results.test = "Vue Lifecycle Test A"
  results.render = timing.rend/1000
  results.destroy = timing.dest/1000
  results.mount = timing.mount/1000
  callback(results)
}

// updating test
var testB = function(callback) {
  results = {};
  results.test = "Vue Lifecycle Test B"
  results.update = timing.update
  callback(results)
}

window.UUT.testA = testA;
window.UUT.testB = testB;
window.UUT.vm = vm();
//consolelog(window.UUT)