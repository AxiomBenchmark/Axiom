class FakeFrameworkTestSuite extends FrameworkTest {
    
    constructor() {
        super();
    }

    runTest(params, callback) {
        console.log('running function ' + params.function + ' on UUT.');
        this[params.function](callback);
    }

    testA(callback) {
        setTimeout(function() {
            //test run in here
            var result = {
                'aResultProperty' : 'A went really well.'
            };
            callback(result);
        }, 3000);
    }

    testB(callback) {
        setTimeout(function() {
            //test run in here
            var result = {
                'aResultProperty' : 'B went OK, could\'ve been better'
            };
            callback(result);
        }, 3000);
    }

    testC(callback) {
        setTimeout(function() {
            //test run in here
            var result = {
                'aResultProperty' : 'C went well.'
            };
            callback(result);
        }, 3000);
    }

}

var UUT = new FakeFrameworkTestSuite();