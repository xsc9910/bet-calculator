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

for (const input of ['1+2+', '1 2', '1+2=3=4', '1+0.123', '1,000+2', '1，2，3']) {
  assert.ok(parse(input).error, `${input} should not be silently accepted`);
  passed += 1;
}

const signedFormulaSource = source.match(/^const signedMoneyFormula = .*;$/m);
assert.ok(signedFormulaSource, 'signed ledger formula formatter is present');
const signedMoneyFormula = vm.runInNewContext(`${signedFormulaSource[0]}\nsignedMoneyFormula`, {
  money: value => Number(value.toFixed(2)).toString(),
});
const signedText = signedMoneyFormula([20, -40, 18, -70]);
assert.equal(signedText, '20-40+18-70');
assert.equal(parse(signedText).total, -72);
passed += 1;

console.log(`STANDALONE_FORMULA_REGRESSION passed=${passed} failed=0`);

const compareStart = source.indexOf('function formulaComparison()');
assert.ok(compareStart >= 0 && compareStart < start, 'ledger comparison is present');
const comparisonSource = source.slice(compareStart, start);
const makeElement = () => ({
  value: '', textContent: '', className: '',
  classList: { toggle() {}, remove() {} },
});
const elements = Object.fromEntries([
  'externalBetFormula', 'betCompareResult', 'dialogExternalTotal',
  'dialogBetFormula', 'externalFormulaPreview', 'currentTotalBox', 'externalTotalBox',
].map(id => [id, makeElement()]));
const context = {
  betEntries: [{ amount: 1000 }, { amount: -72 }],
  entriesForBetBatch: () => [{ amount: -72 }],
  sumMoney: values => values.reduce((sum, value) => sum + Math.round(value * 100), 0) / 100,
  $: id => elements[id],
  money: value => Number(value.toFixed(2)).toString(),
  parseStandaloneFormula: parse,
  sequenceDifference: () => ({ currentFlags: new Set(), externalFlags: new Set() }),
  renderComparedFormula: () => {},
  resetFormulaComparison: () => {},
};
const compare = vm.runInNewContext(`${comparisonSource}\nformulaComparison`, context);
elements.externalBetFormula.value = '20-40+18-70';
compare();
assert.equal(elements.dialogExternalTotal.textContent, '-72');
assert.match(elements.betCompareResult.textContent, /当前合计：-72/);
assert.match(elements.betCompareResult.textContent, /总金额一致/);
passed += 1;

elements.externalBetFormula.value = '20+18=999';
compare();
assert.equal(elements.dialogExternalTotal.textContent, '38');
assert.match(elements.betCompareResult.textContent, /逐项计算38，等号后为999/);
passed += 1;

elements.externalBetFormula.value = '20+18垃圾';
compare();
assert.match(elements.betCompareResult.textContent, /不是加号或减号|没有对应金额/);
passed += 1;

elements.externalBetFormula.value = '-72=0';
compare();
assert.match(elements.betCompareResult.textContent, /逐项计算-72，等号后为0/);
assert.match(elements.betCompareResult.textContent, /逐项金额一致，但等号后标注不一致/);
passed += 1;

console.log(`LEDGER_FORMULA_REGRESSION passed=4 failed=0`);

const claimStart = source.indexOf('function extractClaimedAmount(text)');
const claimEnd = source.indexOf('function normalizedSingleBetNumberSource', claimStart);
assert.ok(claimStart >= 0 && claimEnd > claimStart);
const extractClaimedAmount = vm.runInNewContext(`${source.slice(claimStart, claimEnd)}\nextractClaimedAmount`, {
  normalizeStatedArithmeticTotals: value => value,
});
assert.equal(extractClaimedAmount('双58一倍 合计10元。985一单一组，共18元'), 18);
assert.equal(extractClaimedAmount('合计10元；共18元；计20元'), 20);
assert.equal(extractClaimedAmount('共18元；合计10元'), 10);
console.log('CLAIMED_TOTAL_REGRESSION passed=3 failed=0');
