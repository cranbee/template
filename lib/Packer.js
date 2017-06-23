// object => array
function pack(node) {
    if (node.type === '#') {
        return node.text;
    }
    let result = [node.type];
    let hasAttrs = (Object.keys(node.attrs).length !== 0);
    if (hasAttrs) {
        result.push(node.attrs);
    }
    if (node.children.length === 0) {
        return result;
    }
    if (!hasAttrs) {
        result.push(0);
    }
    for (let i = 0; i < node.children.length; i++) {
        result.push(pack(node.children[i]));
    }
    return result;
}

// array => object
function unpack(packet) {
    if (!Array.isArray(packet)) {
        return { type: '#', text: packet };
    }
    let node = {
        type: packet[0],
        attrs: packet[1] || {},
        children: []
    };
    for (let i = 2; i < packet.length; i++) {
        node.children.push(unpack(packet[i]));
    }
    return node;
}

module.exports = {
    pack,
    unpack
};
