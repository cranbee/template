let Extender = require("./extender.js");

// (array, object) => array
function execute(template, data) {
    let result = [];
    for (let i = 0; i < template.length; i++) {
        let node = template[i];
        result = result.concat(executeNode(node, data));
    }
    return result;
}

// (object, object) => array
function executeNode(node, data) {
    if (node.type === "#") {
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
        children = children.concat(executeNode(child, data));
    }
    return [{ type: node.type, props, children }];
}

// (object, object) => array
function executeText(node, data) {
    return [{
        type: "#",
        text: Extender.processText(node.text, data)
    }];
}

// (object, object) => array
function executeEach(node, data) {
    let each = Extender.processEach(node.props.each, data);
    if (!each) {
        return [];
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.each = null;
    let nextData = Object.assign({}, data);
    let result = [];
    for (let i = 0; i < each.items.length; i++) {
        let item = each.items[i];
        nextData[each.item] = item;
        result = result.concat(executeNode(nextNode, nextData));
    }
    return result;
}

// (object, object) => array
function executeIf(node, data) {
    if (!Extender.processExpr(node.props.if, data)) {
        return [];
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.if = null;
    return executeNode(nextNode, data);
}

// (object, object) => array
function executeFi(node, data) {
    if (Extender.processExpr(node.props.fi, data)) {
        return [];
    }
    let nextNode = {
        type: node.type,
        props: Object.assign({}, node.props),
        children: node.children
    };
    nextNode.props.fi = null;
    return executeNode(nextNode, data);
}

module.exports = {
    execute
};
