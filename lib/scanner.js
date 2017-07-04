let SReader = require('./s-reader.js');
let Tools = require('./tools.js');

let RE_TEXT = /^[^<]+/;
let RE_WS = /^\s+/;
let RE_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9-]*/;
let RE_PROP_NAME = /^[a-z][a-zA-Z0-9-]*/;
let RE_PROP_VALUE = /^[^"\n]*/;

// string => array
function scan(text) {
    let sr = SReader.create(text);
    let tokens = [];
    while (!sr.isDone()) {
        tokens.push(readNext(sr));
    }
    return tokens;
}

// object => object
function readNext(sr) {
    if (sr.accept('<!')) {
        return readComment(sr);
    }
    if (sr.accept('<')) {
        return readTag(sr);
    }
    return readText(sr);
}

// object => object
function readText(sr) {
    let start = sr.getPos();
    let value = sr.expectRE(RE_TEXT);
    return { type: 'text', start, value };
}

// object => object
function readComment(sr) {
    let start = sr.getPos() - 2;
    sr.expect('--');
    if (!sr.goto('-->')) {
        throw Tools.syntaxError('Unterminated comment', start);
    }
    sr.expect('-->');
    return { type: 'comment', start };
}

// object => object
function readTag(sr) {
    let start = sr.getPos() - 1;
    let name;
    if (sr.accept('/')) {
        name = sr.expectRE(RE_TAG_NAME);
        sr.expect('>');
        return { type: 'tag_2', start, name };
    }
    name = sr.expectRE(RE_TAG_NAME);
    let props = {};
    while (true) {
        sr.acceptRE(RE_WS);
        if (sr.accept('>')) {
            return { type: 'tag_1', start, name, props };
        }
        if (sr.accept('/')) {
            sr.expect('>');
            return { type: 'tag_0', start, name, props };
        }
        let pName = sr.expectRE(RE_PROP_NAME);
        sr.acceptRE(RE_WS);
        sr.expect('=');
        sr.acceptRE(RE_WS);
        sr.expect('"');
        let pValue = sr.expectRE(RE_PROP_VALUE);
        sr.expect('"');
        props[pName] = pValue;
    }
}

module.exports = {
    scan
};
