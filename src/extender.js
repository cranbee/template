let Tools = require("./tools.js");

let P_NAME = "[_$a-zA-Z][_$a-zA-Z0-9]*";
let P_PATH = `${P_NAME}(?:\\.(?:${P_NAME}|[0-9]+))*`;
let P_NUMB = "-?[0-9]+(\\.[0-9]+)?";
let P_EXPR = `{(?:(${P_PATH})|(${P_NUMB}))}`;
let P_EACH = `{(${P_NAME}) in (${P_PATH})}`;

let GRE_WS = /\s+/g;
let GRE_EXPR = RegExp(P_EXPR, "g");

let RE_EXPR = RegExp("^" + P_EXPR + "$");
let RE_EACH = RegExp("^" + P_EACH + "$");

// string => boolean
function validateExpr(value) {
    return RE_EXPR.test(value);
}

// string => boolean
function validateEach(value) {
    return RE_EACH.test(value);
}

// (string, object) => any
function processProp(value, data) {
    return RE_EXPR.test(value)
        ? processExpr(value, data)
        : processText(value, data);
}

// (string, object) => string
function processText(value, data) {
    return value
        .replace(GRE_EXPR, m => {
            let res = processExpr(m, data);
            return Tools.isVoid(res) ? "" : res + "";
        })
        .replace(GRE_WS, " ")
        .trim();
}

// (string, object) => any
function processExpr(value, data) {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    let m = value.match(RE_EXPR);
    if (!m) {
        return;
    }
    return m[1] ? processPath(m[1], data) : parseFloat(m[2]);
}

// (string, object) => object | void
function processEach(value, data) {
    let m = value.match(RE_EACH);
    if (!m) {
        return;
    }
    let items = processPath(m[2], data);
    if (!Array.isArray(items)) {
        items = [];
    }
    return { item: m[1], items };
}

// (string, object) => any
function processPath(path, data) {
    return processPathArray(path.split("."), data);
}

// (array, object) => any
function processPathArray(path, data) {
    if (!data) {
        return;
    }
    let value = data[path[0]];
    return path.length > 1 ? processPathArray(path.slice(1), value) : value;
}

module.exports = {
    validateExpr,
    validateEach,
    processProp,
    processText,
    processExpr,
    processEach
};
