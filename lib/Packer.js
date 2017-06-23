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

module.exports = {
    pack
};
