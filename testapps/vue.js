var Vue = require('vue');

var t0 = 0, t1 = 0, t2 = 0, t3 = 0;

var Child = Vue.extend({
    template: '<div>"I am a child!"</div>'
});

var timing = {
  rend: 0,
  dest: 0,
  mount: 0,
  update: 0,
  createChild: 0
};
var results = {};

var vm = function() {
  return new Vue({
    el: '#testbench',
    data: {
      message: 'Hello Vue.js!',
      val: 0,
      children: []
    },
    addChild: function() {
      this.children.push(new Child());
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
      console.log("before updated!")
      t1 = performance.now()
    },
    updated: function() {
      console.log("updated!")
      t3 = performance.now()
    },
    beforeDestroy: function() {
      //console.log("before destroyed!")
    },
    destroyed: function() {
      //console.log("destroyed!")
      t1 = performance.now()
    },
    activated: function() {
      //console.log("activated!")
    },
    deactivated: function() {
      //console.log("deactivated!")
    },
  });
}

// render and destroy test
var testA = function(callback) {
  for(var i = 0; i < 1000; i++) {
    t0 = performance.now()
    let v = vm();
    timing.rend += t1 - t0
    timing.mount += t2 - t0

    t0 = performance.now()
    v.$destroy();
    timing.dest += t1 - t0
  }

  results = {};
  results.test = "Lifecycle Test A"
  results.render = timing.rend/1000
  results.destroy = timing.dest/1000
  results.mount = timing.mount/1000
  callback(results)
}

// updating test
var testB = function(callback) {
  t2 = t3 = 0
  results = {};
  results.test = "Lifecycle Test B"
  let v = vm();
  for (let i = 0; i < 1000; i++) {
    t2 = performance.now()
    v.children.push(new Child());
    v.$forceUpdate();
    Vue.nextTick().then(function() {
      t3 = performance.now()
      timing.update += t3 - t2
      if (i == 999) {
        results.update = timing.update / 1000
        callback(results)
      }
    })
  }
}

var testC = function(callback) {
  t0 = t1 = 0
  results = {};
  results.test = "Child Lifecycle Test"
  let v = vm();
  for (let i = 0; i < 1000; i++){
    t0 = performance.now()
    v.children.push(new Child());
    v.$forceUpdate();
    Vue.nextTick().then(function() {
      t1 = performance.now()
      timing.createChild += t1 - t0
      if (i == 999) {
        results.createChild = timing.createChild / 1000
        callback(results)
      }
    })
  }
}

window.UUT.testA = testA;
window.UUT.testB = testB;
window.UUT.testC = testC;
window.UUT.vm = vm();