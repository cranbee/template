let RE_TEXT = /^[^<]+/;
let RE_WS = /^\s+/;
let RE_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9-]*/;
let RE_PROP_NAME = /^[a-z][a-zA-Z0-9-]*/;
let RE_PROP_VALUE = /^[^"\n]*/;

// string => array
function scan(text) {
    let $ = { text, pos: 0 };
    let tokens = [];
    while ($.pos < $.text.length) {
        tokens.push(readNext($));
    }
    return tokens;
}

// object => object
function readNext($) {
    if (accept($, '<!')) {
        return readComment($);
    }
    if (accept($, '<')) {
        return readTag($);
    }
    return readText($);
}

// object => object
function readText($) {
    let start = $.pos;
    let value = expectRE($, RE_TEXT);
    return { type: 'text', start, value };
}

// object => object
function readComment($) {
    let start = $.pos - 2;
    expect($, '--');
    let index = $.text.indexOf('-->', $.pos);
    if (index === -1) {
        throw syntaxError('Unterminated comment', start);
    }
    $.pos = index + 3;
    return { type: 'comment', start };
}

// object => object
function readTag($) {
    let start = $.pos - 1;
    let name = null;
    if (accept($, '/')) {
        name = expectRE($, RE_TAG_NAME);
        expect($, '>');
        return { type: 'tag_2', start, name };
    }
    name = expectRE($, RE_TAG_NAME);
    let props = {};
    while (true) {
        acceptRE($, RE_WS);
        if (accept($, '>')) {
            return { type: 'tag_1', start, name, props };
        }
        if (accept($, '/')) {
            expect($, '>');
            return { type: 'tag_0', start, name, props };
        }
        let pName = expectRE($, RE_PROP_NAME);
        acceptRE($, RE_WS);
        expect($, '=');
        acceptRE($, RE_WS);
        expect($, '"');
        let pValue = expectRE($, RE_PROP_VALUE);
        expect($, '"');
        props[pName] = pValue;
    }
}

// (object, string) => void
function expect($, str) {
    if (!accept($, str)) {
        throw syntaxError('Unexpected character', $.pos);
    }
}

// (object, string) => boolean
function accept($, str) {
    if (!$.text.startsWith(str, $.pos)) {
        return false;
    }
    $.pos += str.length;
    return true;
}

// (object, regexp) => string
function expectRE($, regexp) {
    let str = acceptRE($, regexp);
    if (str === null) {
        throw syntaxError('Unexpected character', $.pos);
    }
    return str;
}

// (object, regexp) => string | null
function acceptRE($, regexp) {
    let m = $.text.substr($.pos).match(regexp);
    if (!m) {
        return null;
    }
    let str = m[0];
    $.pos += str.length;
    return str;
}

// (string, number) => object
function syntaxError(message, pos) {
    let err = Error(message);
    err.name = 'SyntaxError';
    err.pos = pos;
    return err;
}

module.exports = {
    scan
};
