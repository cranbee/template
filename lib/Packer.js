// object => array
function pack(node) {
    if (node.type === 'text') {
        return node.value;
    }
    let result = [node.name];
    if (node.attrs) {
        result.push(node.attrs);
    }
    if (!node.children) {
        return result;
    }
    if (!node.attrs) {
        result.push(0);
    };
    for (let i = 0; i < node.children.length; i++) {
        result.push(pack(node.children[i]));
    }
    return result;
}

module.exports = {
    pack
};
