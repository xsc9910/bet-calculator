const fs = require('node:fs');
const assert = require('node:assert/strict');

const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const app = Function('localStorage', 'document', 'confirm', 'navigator', `${fs.readFileSync('app.js', 'utf8')}; return { autoCalculateBet, scanEntryForDraw, playStake, plays };`)(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element },
  () => false,
  {}
);

const entry = (original, amount = 10) => ({ id: original, record: 1, original, amount });
const only = (original, lottery, draw, amount) => {
  const wins = app.scanEntryForDraw(entry(original, amount), lottery, draw);
  assert.equal(wins.length, 1, `${original}: ${JSON.stringify(wins)}`);
  return wins[0];
};

const cases = [
  ['直选', only('福123直选一倍', '福彩', '123'), app.plays.direct.prize],
  ['组六', only('福123组选一倍', '福彩', '123'), app.plays.group6.prize],
  ['组三', only('福122组选一倍', '福彩', '122'), app.plays.group3.prize],
  ['4码组六', only('福1234组六一倍', '福彩', '123'), app.plays.group6Multi.prizeBySize[4]],
  ['豹子全包', only('福豹子全包一倍', '福彩', '111'), app.plays.leopardPack.prize],
  ['转圈组六', only('体123转圈一倍', '体彩', '123'), app.plays.circle6.prize],
  ['和值', only('福和值6一倍', '福彩', '123'), app.plays.sum.prizes[6]],
  ['跨度', only('体跨度4一倍', '体彩', '024'), app.plays.span.prizes[4]],
  ['一码定位', only('福百位1一倍', '福彩', '123'), app.plays.pos1.prize],
  ['二码定位', only('体百位1十位2一倍', '体彩', '123'), app.plays.pos2.prize],
  ['直选半元', only('福123直0.5元', '福彩', '123', 0.5), app.plays.direct.prize / 4],
  ['双飞', only('福12双飞一倍', '福彩', '123'), app.plays.doubleFly.prize],
  ['对子', only('体2对子一倍', '体彩', '122'), app.plays.pair.prize],
  ['组六胆拖', only('体胆1拖234组六一倍', '体彩', '123'), app.plays.group6Dan.prizeBySize[4]],
  ['组三胆拖', only('体胆1拖234组三一倍', '体彩', '122'), app.plays.group3Dan.prizeBySize[4]],
  ['粘边赖组六两倍', only('体胆1粘边赖组六两倍', '体彩', '123'), app.plays.sticky6.prize * 2],
];

for (const [name, win, prize] of cases) {
  assert.equal(win.prize, prize, `${name}: ${JSON.stringify(win)}`);
  assert.equal(Number((win.stake * win.odds).toFixed(2)), prize, `${name} odds mismatch`);
}

assert.equal(app.playStake('体136 246各一组120米', 'group'), 2);
const eachGroupWins = app.scanEntryForDraw(
  entry('体136 246各一组120米', 120),
  '体彩',
  '361'
);
assert.equal(eachGroupWins.length, 1, JSON.stringify(eachGroupWins));
assert.equal(eachGroupWins[0].stake, 2, JSON.stringify(eachGroupWins));
assert.equal(eachGroupWins[0].prize, app.plays.group6.prize, JSON.stringify(eachGroupWins));

const duplicatePositionWins = app.scanEntryForDraw(entry(`福
百位定4
十位定3
个位0123456789打1倍
百位定3
十位定4
个位0123456789打1倍
3和4双飞1倍，全包组三打5倍`), '福彩', '823');
assert.equal(duplicatePositionWins.length, 0, JSON.stringify(duplicatePositionWins));

const eachUnitGroupWins = app.scanEntryForDraw(entry('通组选 个3元共192元', 192), '福彩', '823');
assert.equal(eachUnitGroupWins.length, 0, JSON.stringify(eachUnitGroupWins));

const compactDirectGroup = app.autoCalculateBet('964福3十2米合计5');
assert.equal(compactDirectGroup.amount, 5, JSON.stringify(compactDirectGroup));
const compactDirectWins = app.scanEntryForDraw(entry('964福3十2米合计5', 5), '福彩', '964');
assert.equal(compactDirectWins.find(win => win.match === '直选：964')?.stake, 3, JSON.stringify(compactDirectWins));
assert.equal(compactDirectWins.find(win => win.match === '组六单式：964')?.stake, 2, JSON.stringify(compactDirectWins));
const compactGroupWins = app.scanEntryForDraw(entry('964福3十2米合计5', 5), '福彩', '946');
assert.equal(compactGroupWins.length, 1, JSON.stringify(compactGroupWins));
assert.equal(compactGroupWins[0].stake, 2, JSON.stringify(compactGroupWins));

const scopedPositionWins = app.scanEntryForDraw(entry('胆3 3倍 十位2 2倍 3D合计50', 50), '福彩', '823');
const scopedPositionWin = scopedPositionWins.find(win => win.match.startsWith('一码定位：'));
assert.equal(scopedPositionWin?.stake, 20, JSON.stringify(scopedPositionWins));

console.log(`WINNING_ODDS_SUMMARY passed=${cases.length + 8} failed=0`);
