let Extender = require("./extender.js");

// (array, object) => array
function execute(template, data) {
    let result = [];
    for (let i = 0; i < template.length; i++) {
        let node = template[i];
        executeNode(node, data, result);
    }
    return result;
}

// (object, object, array) => undefined
function executeNode(node, data, result) {
    if (node.type === "#") {
        executeText(node, data, result);
        return;
    }
    if (node.props.each) {
        executeEach(node, data, result);
        return;
    }
    if (node.props.if) {
        executeIf(node, data, result);
        return;
    }
    if (node.props.fi) {
        executeFi(node, data, result);
        return;
    }
    let props = {};
    let keys = Object.keys(node.props);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key !== "each" && key !== "if" && key !== "fi") {
            props[key] = Extender.processProp(node.props[key], data);
        }
    }
    let children = [];
    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        executeNode(child, data, children);
    }
    result.push({
        type: node.type,
        props,
        children
    });
}

// (object, object, array) => undefined
function executeText(node, data, result) {
    result.push({
        type: "#",
        text: Extender.processText(node.text, data)
    });
}

// (object, object, array) => undefined
function executeEach(node, data, result) {
    let each = Extender.processEach(node.props.each, data);
    if (!each) {
        return;
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.each = null;
    let nextData = Object.assign({}, data);
    for (let i = 0; i < each.items.length; i++) {
        let item = each.items[i];
        nextData[each.item] = item;
        executeNode(nextNode, nextData, result);
    }
}

// (object, object, array) => undefined
function executeIf(node, data, result) {
    if (!Extender.processExpr(node.props.if, data)) {
        return;
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.if = null;
    executeNode(nextNode, data, result);
}

// (object, object, array) => undefined
function executeFi(node, data, result) {
    if (Extender.processExpr(node.props.fi, data)) {
        return;
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.fi = null;
    executeNode(nextNode, data, result);
}

module.exports = {
    execute
};
