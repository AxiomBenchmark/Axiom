const rules = require('../CustomRules');

const customRules = function(data, userAgentString) {
    userAgentString = userAgentString.toLowerCase();

    rules.forEach(function(rule) {
        console.log(JSON.stringify(rule))
        // process contains rule
        if (rule.contains) {
            if (userAgentString.includes(rule.contains.toLowerCase())) {
                Object.keys(rule.set).forEach(function(field) {
                    data[field] = rule.set[field];
                });
            }
        }
    });

    return data;
}

module.exports = customRules;