const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('function parseStandaloneFormula(value)');
const end = source.indexOf('function limitedStandaloneDifferenceFlags', start);
assert.ok(start >= 0 && end > start, 'standalone formula parser is present');
const parse = vm.runInNewContext(`${source.slice(start, end)}\nparseStandaloneFormula`);

let seed = 20260929;
const random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed;
};

let passed = 0;
for (let caseNo = 0; caseNo < 300; caseNo += 1) {
  const count = 1 + random() % 800;
  const parts = [];
  let expectedCents = 0n;
  for (let index = 0; index < count; index += 1) {
    const cents = BigInt(random() % 100001);
    const sign = index === 0 ? '+' : random() % 3 === 0 ? '-' : '+';
    const amount = `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`;
    parts.push(`${sign}${amount}`);
    expectedCents += sign === '-' ? -cents : cents;
  }
  const input = parts.join(caseNo % 2 ? '\n' : '');
  const result = parse(input);
  assert.equal(result.error, undefined, `case ${caseNo}: ${result.error}`);
  assert.equal(Math.round(result.total * 100), Number(expectedCents), `case ${caseNo}`);
  assert.equal(result.terms.length || 1, count, `case ${caseNo} term count`);
  passed += 1;
}

for (const [input, expected] of [
  ['20-40+18-70', -72],
  ['20－40＋18−70', -72],
  ['20 + 0.5 - 0.25', 20.25],
  ['1+2=3', 3],
  ['1+2=99', 3],
]) {
  assert.equal(parse(input).total, expected, input);
  passed += 1;
}

for (const input of ['1+2+', '1 2', '1+2=3=4', '1+0.123']) {
  assert.ok(parse(input).error, `${input} should not be silently accepted`);
  passed += 1;
}

console.log(`STANDALONE_FORMULA_REGRESSION passed=${passed} failed=0`);
