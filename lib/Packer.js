// object => array
function pack(node) {
    if (node.type === '#') {
        return node.text;
    }
    let result = [node.type];
    let hasProps = (Object.keys(node.props).length !== 0);
    if (hasProps) {
        result.push(node.props);
    }
    if (node.children.length === 0) {
        return result;
    }
    if (!hasProps) {
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
        props: packet[1] || {},
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
