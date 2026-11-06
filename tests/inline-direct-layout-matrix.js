const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,scanEntryForDraw};')(
  { getItem() { return null; }, setItem() {} },
  { getElementById: element, querySelectorAll() { return []; }, createElement: element }, () => false, {}
);
let checks = 0;
const failures = [];
const original = '三弟 434直3倍 344  443  直各一倍 885直3倍 588  858直各一倍一共20';
function verify(text, parts, game) {
  const expected = parts.reduce((total, part) => total + part.numbers.length * part.times * 2, 0);
  const result = api.autoCalculateBet(text);
  checks++;
  if (result.amount !== expected || !result.confident) failures.push({ type: 'amount', text, expected, result });
  const draws = [...new Set(parts.flatMap(part => part.numbers))];
  for (const lottery of ['福彩','体彩']) for (const draw of draws) {
    const prize = lottery === game ? parts.reduce((total, part) => total + part.numbers.filter(number => number === draw).length * part.times * 1900, 0) : 0;
    const wins = api.scanEntryForDraw({ id: 'inline-layout', original: text, amount: 999 }, lottery, draw);
    const actual = wins.reduce((total, win) => total + win.prize, 0);
    checks++;
    if (actual !== prize) failures.push({ type: 'prize', text, lottery, draw, expected: prize, actual });
  }
}
verify(original, [{numbers:['434'],times:3},{numbers:['344','443'],times:1},{numbers:['885'],times:3},{numbers:['588','858'],times:1}], '福彩');
for (const alias of ['三弟','三地','3D','福彩','体','排列三']) {
  for (const numberSeparator of [' ','、','-','+','＋','×']) {
    for (const segmentSeparator of ['', ' ', '，', '；']) {
      for (const style of ['直各', '直选各打', '数直']) {
        const parts = [{numbers:['013','310'],times:3},{numbers:['112','121','112'],times:1},{numbers:['013'],times:2}];
        const segments = parts.map(part => {
          const numbers = part.numbers.join(numberSeparator);
          const times = style === '直各' ? ['零','一','二','三'][part.times] : part.times;
          return style === '数直' ? `${numbers} ${part.times}直` : `${numbers}${style}${times}倍`;
        });
        verify(alias + segments.join(segmentSeparator) + '一共22', parts, /体|排/.test(alias) ? '体彩' : '福彩');
      }
    }
  }
}
fs.mkdirSync('tests/reports', {recursive:true});
fs.writeFileSync('tests/reports/inline-direct-layout-matrix.json', JSON.stringify({checks,failures},null,2));
console.log(JSON.stringify({checks,failures:failures.length,examples:failures.slice(0,10)},null,2));
if (failures.length) process.exitCode = 1;
