let Executor = require("../lib/executor.js");
let FS = require("fs");
let Parser = require("../lib/parser.js");
let Scanner = require("../lib/scanner.js");

// () => undefined
function main() {
    let source = FS.readFileSync(`${__dirname}/template.html`, "utf-8");
    console.log();
    testScanner(source, 1000, 10);
    testParser(source, 1000, 10);
    testExecutor(source, 100, 100, 10);
}

// (string, number, number) => undefined
function testScanner(source, ns, ni) {
    console.log("Testing Scanner...");
    let hugeSource = source.repeat(ns);
    let mem = [];
    let start = Date.now();
    for (let i = 0; i < ni; i++) {
        mem.push(Scanner.scan(hugeSource));
    }
    console.log(`Time: ${Date.now() - start} ms`);
    console.log(`Ignore: ${mem.length}`);
    console.log();
}

// (string, number, number) => undefined
function testParser(source, ns, ni) {
    console.log("Testing Parser...");
    let hugeSource = source.repeat(ns);
    let tokens = Scanner.scan(hugeSource);
    let mem = [];
    let start = Date.now();
    for (let i = 0; i < ni; i++) {
        mem.push(Parser.parse(tokens));
    }
    console.log(`Time: ${Date.now() - start} ms`);
    console.log(`Ignore: ${mem.length}`);
    console.log();
}

// (string, number, number, number) => undefined
function testExecutor(source, ns, nd, ni) {
    console.log("Testing Executor...");
    let hugeSource = source.repeat(ns);
    let tokens = Scanner.scan(hugeSource);
    let nodes = Parser.parse(tokens);
    let hugeData = { items: [] };
    for (let i = 0; i < nd; i++) {
        let isAvailable = i % 2 === 0;
        hugeData.items.push({
            title: `Product ${i}`,
            brand: `Brand ${i}`,
            price: 100 + i,
            url: `/products/${i}.html`,
            imageUrl: `/images/products/a-${i}.jpg`,
            isAvailable,
            mods: isAvailable ? "_av" : "_na"
        });
    }
    let mem = [];
    let start = Date.now();
    for (let i = 0; i < ni; i++) {
        mem.push(Executor.execute(nodes, hugeData));
    }
    console.log(`Time: ${Date.now() - start} ms`);
    console.log(`Ignore: ${mem.length}`);
    console.log();
}

main();
