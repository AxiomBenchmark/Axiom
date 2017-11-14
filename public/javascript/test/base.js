class FrameworkTest {
    
        constructor() {
            this.RESULTS = [];
            this.tests = 2;
            this.start = null;
        }

        nextTest(next) {
            if (next != null) {
                next();
            }
        }
    
        timerStart() {
            this.start = performance.now();
        }
    
        timerEnd() {
            var elapsed = performance.now() - this.start;
            return elapsed;
        }
    
        addResult(test, results) {
            this.RESULTS[test] = results;
        }
    
        sendResults() {
            console.log('results sent');
        }
}