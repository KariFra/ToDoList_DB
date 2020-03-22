// console.log(module);




// przypisanie anonimowej funkcji do zmiannej.mozna wykorzystac skrot w node.js i nie pisac module
exports.getDate = function() {

    let date = new Date();
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return date.toLocaleDateString("en-US", options);
};



module.exports.getDay = function() {

    let date = new Date();
    let options = {
        weekday: 'long',
    }

    return date.toLocaleDateString("en-US", options);
};