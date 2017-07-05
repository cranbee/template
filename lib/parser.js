let Extender = require('./extender.js');
let TReader = require('./t-reader.js');
let Tools = require('./tools.js');

let GRE_WS = /\s+/g;

// array => array
function parse(tokens) {
    let tr = TReader.create(prepareTokens(tokens));
    let nodes = [];
    while (true) {
        if (tr.accept('$')) {
            return nodes;
        }
        if (tr.accept('text')) {
            nodes.push(parseText(tr));
        }
        if (tr.accept('tag_0')) {
            nodes.push(parseTag0(tr));
        }
        tr.expect('tag_1');
        nodes.push(parseTag1(tr));
    }
}

// array => array
function prepareTokens(tokens) {
    let result = [];
    let lastToken;
    tokens.forEach(token => {
        let newToken;
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
function parseText(tr) {
    return {
        type: '#',
        text: tr.getToken().value
    };
}

// object => object
function parseTag0(tr) {
    return initTagNode(tr.getToken());
}

// object => object
function parseTag1(tr) {
    let startToken = tr.getToken();
    let node = initTagNode(startToken);
    while (true) {
        if (tr.accept('text')) {
            node.children.push(parseText(tr));
        } else if (tr.accept('tag_0')) {
            node.children.push(parseTag0(tr));
        } else if (tr.accept('tag_1')) {
            node.children.push(parseTag1(tr));
        } else if (tr.accept('tag_2')) {
            let token = tr.getToken();
            if (token.name !== startToken.name) {
                let msg = `Unexpected closing tag "${token.name}"`;
                throw Tools.syntaxError(msg, token.start);
            }
            return node;
        } else {
            let msg = `Unclosed tag "${startToken.name}"`;
            throw Tools.syntaxError(msg, startToken.start);
        }
    }
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

module.exports = {
    parse
};
