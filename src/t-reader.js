let Tools = require("./tools.js");

// array => object
function create(tokens) {
    return Tools.instance({
        tokens,
        pos: 0
    }, {
        getToken,
        expect,
        accept
    });
}

// object => object | undefined
function getToken($) {
    return $.tokens[$.pos - 1];
}

// (object, string) => undefined
function expect($, type) {
    if (!accept($, type)) {
        let token = $.tokens[$.pos];
        throw Tools.syntaxError("Unexpected token", token.start);
    }
}

// (object, string) => boolean
function accept($, type) {
    let token = $.tokens[$.pos];
    if (token.type !== type) {
        return false;
    }
    $.pos++;
    return true;
}

module.exports = {
    create
};
