// (object, object) => object
function instance(state, methods) {
    let api = {};
    Object.keys(methods).forEach(key => {
        api[key] = methods[key].bind(null, state);
    });
    return api;
}

// any => boolean
function isVoid(value) {
    return value === undefined || value === null;
}

// (string, number) => object
function syntaxError(message, pos) {
    let err = Error(message);
    err.name = "SyntaxError";
    err.pos = pos;
    return err;
}

module.exports = {
    instance,
    isVoid,
    syntaxError
};
