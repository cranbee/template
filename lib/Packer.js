// array => array
function pack(nodes) {
    return nodes.map(packNode);
}

// array => array
function unpack(packet) {
    return packet.map(unpackNode);
}

// object => (array | string)
function packNode(node) {
    if (node.type === '#') {
        return node.text;
    }
    let item = [node.type];
    let hasProps = (Object.keys(node.props).length !== 0);
    if (hasProps) {
        item.push(node.props);
    }
    if (node.children.length === 0) {
        return item;
    }
    if (!hasProps) {
        item.push(0);
    }
    for (let i = 0; i < node.children.length; i++) {
        item.push(packNode(node.children[i]));
    }
    return item;
}

// (array | string) => array
function unpackNode(item) {
    if (!Array.isArray(item)) {
        return { type: '#', text: item };
    }
    let node = {
        type: item[0],
        props: item[1] || {},
        children: []
    };
    for (let i = 2; i < item.length; i++) {
        node.children.push(unpackNode(item[i]));
    }
    return node;
}

module.exports = {
    pack,
    unpack
};
