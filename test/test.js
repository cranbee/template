let FS = require('fs');
let Test = require('tape');
let Scanner = require('../lib/Scanner.js');
let Parser = require('../lib/Parser.js');
let Packer = require('../lib/Packer.js');

Test('Scan -> Parse -> Pack', t => {
    let source = FS.readFileSync(`${__dirname}/test.html`, 'utf-8');
    let tokens = Scanner.scan(source);
    compareWithSample(t, tokens, 'tokens');
    let ast = Parser.parse(tokens);
    compareWithSample(t, ast, 'ast');
    let packet = Packer.pack(ast);
    compareWithSample(t, packet, 'packet');
    t.end();
});

// (object, object | array, string) => void
function compareWithSample(t, obj, name) {
    let json = JSON.stringify(obj, null, 2);
    let sample = FS.readFileSync(`${__dirname}/samples/${name}.json`, 'utf-8');
    let lines1 = json.split('\n');
    let lines2 = sample.split('\n');
    let n = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < n; i++) {
        let line1 = lines1[i] || '';
        let line2 = lines2[i] || '';
        if (line1 !== line2) {
            t.equal(line1, line2, `${name}.json at line ${i + 1}`);
            return;
        }
    }
    t.pass(`${name}.json`);
}
