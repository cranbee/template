let Tools = require("./tools.js");

let P_ID = "[_$a-zA-Z][_$a-zA-Z0-9]*";
let P_PATH = `${P_ID}(?:\\.(?:${P_ID}|[0-9]+))*`;
let P_NUM = "-?[0-9]+(\\.[0-9]+)?";
let P_EXP = `((${P_PATH})|(${P_NUM}))`;

let GRE_PATH_IN_CB = RegExp(`{(${P_PATH})}`, "g");
let GRE_WS = /\s+/g;

let RE_EACH = RegExp(`^(${P_ID})\\sin\\s(${P_PATH})$`);
let RE_EXP = RegExp(`^${P_EXP}$`);
let RE_EXP_IN_CB = RegExp(`^{${P_EXP}}$`);

// string => boolean
function validateEach(value) {
    return RE_EACH.test(value);
}

// string => boolean
function validateExp(value) {
    return RE_EXP.test(value);
}

// (string, object) => any
function processProp(value, data) {
    let m = value.match(RE_EXP_IN_CB);
    return m ? processExp(m[1], data) : processText(value, data);
}

// (string, object) => string
function processText(value, data) {
    return value
        .replace(GRE_PATH_IN_CB, (m, p1) => {
            let res = processPath(p1, data);
            return Tools.isVoid(res) ? "" : res + "";
        })
        .replace(GRE_WS, " ")
        .trim();
}

// (string, object) => object
function processEach(value, data) {
    let m = value.match(RE_EACH);
    let items = processPath(m[2], data);
    if (!Array.isArray(items)) {
        items = [];
    }
    return { item: m[1], items };
}

// (string, object) => any
function processExp(value, data) {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return false;
    }
    let m = value.match(RE_EXP);
    return m[2] ? processPath(m[2], data) : parseFloat(m[3]);
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
    validateEach,
    validateExp,
    processProp,
    processText,
    processEach,
    processExp
};
