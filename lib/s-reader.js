let Tools = require('./tools.js');

// string => object
function create(text) {
    return Tools.instance({
        text,
        pos: 0
    }, {
        isDone,
        getPos,
        expect,
        accept,
        expectRE,
        acceptRE,
        goto
    });
}

// object => boolean
function isDone($) {
    return $.pos === $.text.length;
}

// object => number
function getPos($) {
    return $.pos;
}

// (object, string) => void
function expect($, str) {
    if (!accept($, str)) {
        throw Tools.syntaxError('Unexpected character', $.pos);
    }
}

// (object, object) => string
function expectRE($, regexp) {
    let str = acceptRE($, regexp);
    if (str === undefined) {
        throw Tools.syntaxError('Unexpected character', $.pos);
    }
    return str;
}

// (object, string) => boolean
function accept($, str) {
    if (!$.text.startsWith(str, $.pos)) {
        return false;
    }
    $.pos += str.length;
    return true;
}

// (object, object) => string | void
function acceptRE($, regexp) {
    let m = $.text.substr($.pos).match(regexp);
    if (!m) {
        return undefined;
    }
    let str = m[0];
    $.pos += str.length;
    return str;
}

// (object, string) => boolean
function goto($, str) {
    let index = $.text.indexOf('-->', $.pos);
    if (index === -1) {
        return false;
    }
    $.pos = index;
    return true;
}

module.exports = {
    create
};
