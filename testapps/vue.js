var Vue = require('vue');

new Vue({
  el: '#app',
  render: function () {
    console.log('render');
    return "<div>test</div>";
  }
})