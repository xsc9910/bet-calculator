const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet, scanEntryForDraw, parseSharedSingleAndGroup3};')({ getItem() { return null; }, setItem() {} }, { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {});
const numbers = '019 029 039 409 059 069 079 089 129 139 149 159 169 179 189 239 249 259 269 279 289 349 359 369 379 389 459 469 479 489 569 579 589 679 689 789';
const original = `福${numbers}组二元，三码组三一元\n合计108`;
const cases = [[original, 108, 108]];
for (const lottery of ['福', '体', '福体']) {
  for (const label of ['组', '组选', '组六']) {
    for (const separator of ['，', ' ', '\n']) {
      const factor = lottery === '福体' ? 2 : 1;
      cases.push([`${lottery}019 129 ${label}2元${separator}三码组三1元`, 6 * factor, '']);
      cases.push([`${lottery}三码组三1元${separator}${label}2元\n019 129`, 6 * factor, '']);
    }
  }
}
cases.push(['福019 019组2元，三码组三1元合计6', 6, 6]);
cases.push(['福019 129组两倍，三码组三一倍合计28', 28, 28]);
cases.push(['体019 129组三五毛，组选0.2元', 1.4, '']);
cases.push(['福019组二元，三码组三一元共99', 3, 99]);
cases.push(['福019组二元，三码组三一元\n体129组二元，三码组三一元\n合计6', 6, 6]);
for (const [source, amount, claimed] of cases) {
  const result = api.autoCalculateBet(source);
  assert.deepEqual([result.amount, result.claimed, result.confident], [amount, claimed, true], JSON.stringify({ source, result }));
}
for (const [draw, prize] of [['190', 310], ['119', 53], ['999', 0], ['234', 0]]) {
  const wins = api.scanEntryForDraw({ id: 'shared', original: '福019组二元，三码组三一元', amount: 3 }, '福彩', draw);
  assert.equal(wins.reduce((total, win) => total + win.prize, 0), prize, JSON.stringify({ draw, wins }));
  if (wins.length) assert.equal(wins[0].stake, draw === '190' ? 2 : 1);
}
const sharedWins = api.scanEntryForDraw({ id: 'original', original, amount: 108 }, '福彩', '119');
assert.equal(sharedWins.length, 8);
assert.equal(sharedWins.reduce((total, win) => total + win.prize, 0), 424);
assert.ok(sharedWins.every(win => win.stake === 1));
for (const text of ['福019组2元129组三1元', '福019组2元体129组三1元', '福019 129组2元，三码组三', '福019组2元三码组三1元双飞19']) {
  assert.equal(api.parseSharedSingleAndGroup3(text), null, text);
}
console.log(`SHARED_SINGLE_GROUP3 passed=${cases.length} plus payout checks`);
