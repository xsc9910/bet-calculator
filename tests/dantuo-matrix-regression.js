const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, classList: { toggle() {}, add() {}, remove() {} }, replaceChildren() {}, append() {}, setAttribute() {} });
const api = Function('localStorage', 'document', 'confirm', 'navigator', fs.readFileSync('app.js', 'utf8') + ';return {autoCalculateBet,normalizeBetAliases};')({getItem(){return null;},setItem(){}}, {getElementById:element,querySelectorAll(){return [];},createElement:element}, () => false, {});
const cases = [];
for (const selection of ['3拖125678', '胆3拖125678', '胆码3拖码125678', '拖码125678胆码3', '胆码：3 拖码：125678']) {
  for (const play of ['组三', '组六']) {
    for (const [stake, amount] of [['40元', 40], ['2倍', 20], ['40', 40], ['0.5元', 0.5]]) {
      for (const body of [`${selection}${play}${stake}`, `${play}${selection} ${stake}`, `${play}${stake} ${selection}`, `${selection} ${stake}${play}`, `${stake}${play} ${selection}`, `${stake} ${selection}${play}`]) {
        cases.push([`福${body}`, amount]);
      }
    }
  }
}
for (const separator of ['\n', ' ', '，', '；']) {
  cases.push([`福3拖125678${separator}1拖234679组六各40组三20`, 120]);
  cases.push([`福3拖125678组六40组三20${separator}1拖234679组三10组六30`, 100]);
  cases.push([`福3拖125678组六40组三20${separator}体1拖234679组三10组六30`, 100]);
}
cases.push(
  ['福\n3拖125678\n1拖234679\n组六各40组三20\n合计120', 120, 120],
  ['福体3拖125678组六40组三20', 120],
  ['福3拖125678组六40组三20\n体1拖234679组三10组六30\n共999', 100, 999],
  ['福3拖125678组三组六各2倍', 40],
  ['福3拖125678组三组六5', 10],
  ['福7拖0134组六组三5\n4拖2369组六组三5\n5拖0189组六组三5\n7拖3468组六组三5\n7拖1239组六组三5', 50],
  ['福3拖125678组三组六5元', 5],
  ['福3拖125678组三组六各5元', 10],
  ['福3拖125678组三5组六10', 15],
  ['福3拖125678组三2倍组六30元', 50],
  ['福组三\n3拖125678\n1拖234679\n各20元', 40],
  ['福3拖125678组三40\n123直选2倍', 44],
  ['福3拖125678组三40\n体123直选2倍', 44],
  ['福3拖125678组三40\n体1拖234679', null],
  ['福3拖125678组三40\n1拖234679未知玩法20元', null],
  ['福3拖125678组三40\n体1拖234679\n123直选2倍', null],
  ['福组三3拖12567840元', null],
  ['福组六3拖1256782倍', null],
  ['福3拖125678组三40组六', null],
  ['福3拖125678组三40元\n1拖234679组三', null],
  ['福3拖125678组三', null]
);
for (let shift = 0; shift < 10; shift += 1) {
  const change = text => text.replace(/\d/g, digit => String((Number(digit) + shift) % 10));
  const first = change('3拖125678');
  const second = change('1拖234679');
  const firstMoney = 12 + shift;
  const secondMoney = 21 + shift;
  for (const delimiter of [' ', '\n', '；', '，']) {
    cases.push([`福${first}${delimiter}${second}组六各${firstMoney}组三${secondMoney}`, 2 * (firstMoney + secondMoney)]);
    cases.push([`福${first}组六${firstMoney}组三${secondMoney}${delimiter}体${second}组三${shift + 1}倍`, firstMoney + secondMoney + (shift + 1) * 10]);
  }
}
let failed = 0;
for (const [text, expected, claimed] of cases) {
  const result = api.autoCalculateBet(text);
  const valid = expected === null ? !result.confident || result.amount === ''
    : result.confident && result.amount === expected && (claimed === undefined || result.claimed === claimed);
  if (!valid) { failed += 1; console.log('FAIL', JSON.stringify({text, normalized: api.normalizeBetAliases(text), expected, claimed, result})); }
}
console.log(`DANTUO_MATRIX_SUMMARY passed=${cases.length - failed} failed=${failed}`);
if (failed) process.exitCode = 1;
