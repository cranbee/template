let Data = require('./data.js');
let FS = require('fs');
let Template = require('../index.js');
let Test = require('tape');

Test('Scan -> Parse -> Pack', t => {
    let source = FS.readFileSync(`${__dirname}/template.html`, 'utf-8');
    let tokens = Template.scan(source);
    compareWithSample(t, tokens, 'tokens');
    let nodes = Template.parse(tokens);
    compareWithSample(t, nodes, 'nodes');
    let packet = Template.pack(nodes);
    compareWithSample(t, packet, 'packet');
    t.end();
});

Test('Unpack -> Execute', t => {
    let json = FS.readFileSync(`${__dirname}/samples/packet.json`, 'utf-8');
    let packet = JSON.parse(json);
    let nodes = Template.unpack(packet);
    compareWithSample(t, nodes, 'nodes');
    let result = Template.execute(nodes, Data.get());
    compareWithSample(t, result, 'result');
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
