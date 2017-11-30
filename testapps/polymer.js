var Polymer = require('polymer');

Polymer({
    is: 'hello-world',
    properties: {
        who: {
            type: String,
            value: 'World'
        }
    }
});