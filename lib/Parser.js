let RE_WS = /\s+/g;

// array => object
function parse(tokens) {
    let $ = {
        tokens: prepareTokens(tokens),
        pos: 0,
        token: null
    };
    let rootNode = null;
    if (accept($, 'tag_0')) {
        rootNode = parseTag0($);
    } else {
        expect($, 'tag_1');
        rootNode = parseTag1($);
    }
    expect($, '$');
    return rootNode;
}

// array => array
function prepareTokens(tokens) {
    let result = [];
    let lastToken = null;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let newToken = null;
        if (token.type === 'text') {
            let value = token.value.replace(RE_WS, ' ').trim();
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
    }
    result.push({ type: '$' });
    return result;
}

// object => object
function parseText($) {
    return {
        type: 'text',
        value: $.token.value
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
    return {
        type: 'tag',
        name: token.name,
        attrs: token.attrs,
        children: []
    };
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
