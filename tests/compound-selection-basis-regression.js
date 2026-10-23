const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const cases = [
  ['福234复试一倍', 12], ['福1234复试一倍', 10],
  ['福123组三一倍', 10], ['福112组三一倍', 2],
  ['234复试', 12], ['1234复试', 10],
  ['福234复试2倍合计24', 24], ['福1234复式三倍共30', 30],
  ['福123组三一倍合计10', 10], ['112组三三倍体合计6', 6],
  ['福组三一倍123', 10], ['体组三两倍112', 4],
  ['体复试两倍234', 24], ['福复试一倍1234', 10],
  ['福234 567复试各一倍', 24], ['福123 112组三各两倍', 24],
  ['福123组三50米', 50], ['福112组三50米', 50],
  ['福1234复试50元', 50], ['福234复试0.5米', 3],
  ['福123组三一倍合计12', 10],
  ['福234复试一倍\n体1234复试两倍\n合计32', 32],
  ['福体234复试一倍', 24], ['福体112组三一倍', 4]
];
for (const lottery of ['福', '体']) {
  for (const [number, play, base] of [['056', '复试', 12], ['0567', '复式', 10], ['579', '组三', 10], ['557', '组三', 2]]) {
    for (const times of [1, 2, 5]) {
      cases.push([`${lottery}${number}${play}${times}倍`, base * times]);
      cases.push([`${play}${times}倍\n${number}${lottery}合计${base * times}`, base * times]);
      cases.push([`${lottery}${times}倍${play}${number}`, base * times]);
    }
  }
}
let failures = 0;
for (const [source, amount] of cases) {
  const result = api.autoCalculateBet(source);
  try { assert.deepEqual([result.amount, result.confident], [amount, true]); }
  catch { failures++; console.log(JSON.stringify({ source, expected: amount, result })); }
}
assert.equal(failures, 0);
assert.equal(api.autoCalculateBet('福123组三一倍合计12').claimed, 12);
const payoutCases = [
  ['福234复试一倍', '432', 2, 1900],
  ['福1234复试一倍', '432', 10, 145],
  ['福123组三一倍', '112', 10, 530],
  ['福112组三一倍', '121', 2, 620],
  ['福123组三50米', '223', 50, 2650]
];
for (const [original, draw, stake, prize] of payoutCases) {
  const wins = api.scanEntryForDraw({ id: 'basis', original, amount: api.autoCalculateBet(original).amount, record: 1 }, '福彩', draw);
  assert.deepEqual(wins.map(win => [win.stake, win.prize]), [[stake, prize]], JSON.stringify({ original, wins }));
}
for (const [original, draw] of [['福123组三一倍', '123'], ['福123组三一倍', '444'], ['福234复试一倍', '223']]) {
  assert.deepEqual(api.scanEntryForDraw({ id: 'miss', original }, '福彩', draw), []);
}
console.log(`COMPOUND_SELECTION_BASIS passed=${cases.length} plus payout checks`);
