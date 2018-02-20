const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// generate an id in the format ###-ABC-###
module.exports.generate = function() {
    var id = "";
    for (var i = 0; i < 9; i++) {
        if (i > 2 && i < 6) {
            const index = Math.floor(Math.random() * 26);
            id += alphabet[index];
        } else {
            const number = Math.floor(Math.random() * 10);
            id += number;
        }
    }
    return id;
}

module.exports.validate = function(id) {
    const idFormat = RegExp("[0-9][0-9][0-9][A-Z][A-Z][A-Z][0-9][0-9][0-9]");
    return idFormat.test(id.toUpperCase()) && id.length === 9;
};