let Extender = require('./extender.js');

// (array, object) => array
function execute(nodes, data) {
    return nodes.map(node => executeNode(node, data));
}

// (object, object) => array
function executeNode(node, data) {
    if (node.type === '#') {
        return executeText(node, data);
    }
    if (node.props.each) {
        return executeEach(node, data);
    }
    if (node.props.if) {
        return executeIf(node, data);
    }
    if (node.props.fi) {
        return executeFi(node, data);
    }
    let props = {};
    Object.keys(node.props).forEach(key => {
        if (key !== 'each' && key !== 'if' && key !== 'fi') {
            props[key] = Extender.processProp(node.props[key], data);
        }
    });
    let children = [];
    node.children.forEach(child => {
        children = children.concat(executeNode(child, data));
    });
    return [{ type: node.type, props, children }];
}

// (object, object) => array
function executeText(node, data) {
    return [{
        type: '#',
        text: Extender.processText(node.text, data)
    }];
}

// (object, object) => array
function executeEach(node, data) {
    let each = Extender.processEach(node.props.each, data);
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.each = undefined;
    let nextData = Object.assign({}, data);
    let result = [];
    each.items.forEach(item => {
        nextData[each.item] = item;
        result = result.concat(executeNode(nextNode, nextData));
    });
    return result;
}

// (object, object) => array
function executeIf(node, data) {
    if (!Extender.processExp(node.props.if, data)) {
        return [];
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.if = undefined;
    return executeNode(nextNode, data);
}

// (object, object) => array
function executeFi(node, data) {
    if (Extender.processExp(node.props.fi, data)) {
        return [];
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.fi = undefined;
    return executeNode(nextNode, data);
}

module.exports = {
    execute
};
