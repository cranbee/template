let Extender = require('./Extender.js');

let GRE_WS = /\s+/g;

// array => array
function parse(tokens) {
    let $ = {
        tokens: prepareTokens(tokens),
        pos: 0,
        token: null
    };
    let nodes = [];
    while (true) {
        if (accept($, '$')) {
            return nodes;
        }
        if (accept($, 'text')) {
            nodes.push(parseText($));
        }
        if (accept($, 'tag_0')) {
            nodes.push(parseTag0($));
        }
        expect($, 'tag_1');
        nodes.push(parseTag1($));
    }
}

// array => array
function prepareTokens(tokens) {
    let result = [];
    let lastToken = null;
    tokens.forEach(token => {
        let newToken = null;
        if (token.type === 'text') {
            let value = token.value.replace(GRE_WS, ' ').trim();
            if (value !== '') {
                if (lastToken && lastToken.type === 'text') {
                    lastToken.value += value;
                } else {
                    newToken = { type: 'text', start: token.start, value };
                }
            }
        } else if (token.type !== 'comment') {
            newToken = token;
        }
        if (newToken) {
            result.push(newToken);
            lastToken = newToken;
        }
    });
    result.push({ type: '$' });
    return result;
}

// object => object
function parseText($) {
    return {
        type: '#',
        text: $.token.value
    };
}

// object => object
function parseTag0($) {
    return initTagNode($.token);
}

// object => object
function parseTag1($) {
    let startToken = $.token;
    let node = initTagNode($.token);
    while (true) {
        if (accept($, 'text')) {
            node.children.push(parseText($));
        } else if (accept($, 'tag_0')) {
            node.children.push(parseTag0($));
        } else if (accept($, 'tag_1')) {
            node.children.push(parseTag1($));
        } else if (accept($, 'tag_2')) {
            if ($.token.name !== startToken.name) {
                throw syntaxError(`Unexpected closing tag "${$.token.name}"`, $.token);
            }
            return node;
        } else {
            throw syntaxError(`Unclosed tag "${startToken.name}"`, startToken);
        }
    }
}

// (object, string) => void
function expect($, type) {
    if (!accept($, type)) {
        throw syntaxError('Unexpected token', $.tokens[$.pos]);
    }
}

// (object, string) => boolean
function accept($, type) {
    if ($.tokens[$.pos].type !== type) {
        return false;
    }
    $.token = $.tokens[$.pos];
    $.pos++;
    return true;
}

// object => object
function initTagNode(token) {
    Object.keys(token.props).forEach(key => {
        if (!validateProp(key, token.props[key])) {
            throw syntaxError(`Invalid value for "${key}" property`, token);
        }
    });
    return {
        type: token.name,
        props: token.props,
        children: []
    };
}

// (string, string) => boolean
function validateProp(key, value) {
    switch (key) {
    case 'each':
        return Extender.validateEach(value);
    case 'if':
    case 'fi':
        return Extender.validateExp(value);
    default:
        return true;
    }
}

// (string, object) => object
function syntaxError(message, token) {
    let err = Error(message);
    err.name = 'SyntaxError';
    err.pos = token.start;
    return err;
}

module.exports = {
    parse
};
