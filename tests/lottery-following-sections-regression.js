const fs = require('fs');
const assert = require('assert/strict');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,scanEntryForDraw};')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {}
);
const original = `福 233 456 237 899 333一单一组
体232 344 343 444二直一组`;
let checks = 0;
const base = [
  { game: '福彩', numbers: ['233','456','237','899','333'], direct: 2, group: 2 },
  { game: '体彩', numbers: ['232','344','343','444'], direct: 4, group: 2 }
];
const tails = [
  ['', 0, []],
  ['567一直一组', 4, [{ game: '体彩', numbers: ['567'], direct: 2, group: 2 }]],
  ['福567一直一组', 4, [{ game: '福彩', numbers: ['567'], direct: 2, group: 2 }]],
  ['体567组六10米', 10, [{ game: '体彩', numbers: ['567'], direct: 0, group: 10 }]],
  ['567组六10米', 10, [{ game: '体彩', numbers: ['567'], direct: 0, group: 10 }]],
  ['福胆8打20元', 20, [{ game: '福彩', dan: '8', stake: 20 }]],
  ['福体567一直一组', 8, ['福彩','体彩'].map(game => ({ game, numbers: ['567'], direct: 2, group: 2 }))],
  ['体567组3米单1米', 4, [{ game: '体彩', numbers: ['567'], direct: 1, group: 3 }]],
  ['福456直3元组1元', 4, [{ game: '福彩', numbers: ['456'], direct: 3, group: 1 }]]
];
const failures = [];
for (const separator of ['\n', '\n\n', '；', ' ']) {
  for (const [tail, extra, extraParts] of tails) {
    const text = original.replace('\n', separator) + (tail ? separator + tail : '') + '\n共999';
    const result = api.autoCalculateBet(text);
    checks++;
    if (result.amount !== 44 + extra || !result.confident || result.claimed !== 999) failures.push({ type: 'amount', text, result, expected: 44 + extra });
    for (const lottery of ['福彩','体彩']) for (const draw of ['233','456','237','899','333','232','344','343','444','567','765','888']) {
      let expected = 0;
      for (const part of [...base, ...extraParts]) {
        if (part.game !== lottery) continue;
        if (part.dan) {
          // The configured single-digit odds are checked separately by existing odds tests.
          const single = api.scanEntryForDraw({ id:'single', original:`福胆${part.dan}打${part.stake}元`, amount:part.stake }, lottery, draw);
          expected += single.reduce((sum, win) => sum + win.prize, 0);
          continue;
        }
        for (const number of part.numbers) {
          if (number === draw) expected += part.direct * 950;
          if (new Set(draw).size > 1 && [...number].sort().join('') === [...draw].sort().join('')) expected += part.group * (new Set(draw).size === 2 ? 310 : 155);
        }
      }
      const wins = api.scanEntryForDraw({id:'scope',record:77,batchRecord:9,original:text,amount:999},lottery,draw);
      const actual = wins.reduce((sum, win) => sum + win.prize, 0);
      checks++;
      if (actual !== expected) failures.push({type:'prize',text,lottery,draw,expected,actual});
      assert.equal(new Set(wins.map(win => win.id)).size, wins.length);
      for (const win of wins) assert.equal(win.record, 77);
    }
  }
}
console.log(JSON.stringify({checks,failures:failures.length,examples:failures.slice(0,12)},null,2));
if (failures.length) process.exitCode = 1;
