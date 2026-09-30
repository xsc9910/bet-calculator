const fs = require('fs');
const element = () => ({ value: '', checked: false, options: [], style: {}, className: '', textContent: '',
  classList: { toggle() {}, add() {}, remove() {} }, closest() { return null; }, replaceChildren() {}, append() {},
  setAttribute() {}, showModal() {}, close() {} });
const calculate = Function('localStorage', 'document', 'confirm', 'navigator',
  fs.readFileSync('app.js', 'utf8') + '; return autoCalculateBet;')(
    { getItem() { return null; }, setItem() {} },
    { getElementById: element, querySelectorAll() { return []; }, createElement: element },
    () => false, { clipboard: { writeText() {} } });

const cases = [
  ['福排 means 福体', '\u798f\u6392\u0031\u0032-\u0033\u0034\u53cc\u98de\u5404\u0031\u0030\u5143', 40],
  ['全倒 means 转圈', '\u4f53\u5168\u5012\u0031\u0032\u0033\u0034\u7ec4\u516d\u4e00\u500d', 48],
  ['组三复试 shared amount', '1234\u7ec4\u4e09\u590d\u8bd5\u540420', 40],
  ['组六复试 shared amount', '1234\u7ec4\u516d\u590d\u8bd5\u540420', 40],
  ['direct only does not add group', '\u798f123 456\u76f4\u5404\u4e00\u500d', 4],
  ['group only does not add direct', '\u798f123 456\u7ec4\u5404\u4e00\u500d', 4],
  ['group6 multi only', '\u798f1234\u7ec4\u516d20\u5143', 20],
  ['direct multi only', '\u798f1234\u590d\u8bd5\u540420\u5143', 20],
  ['group3 multi only with each', '\u798f1234\u7ec4\u4e09\u590d\u5f0f\u540420\u5143', 20],
  ['group6 multi only with each', '\u798f1234\u7ec4\u516d\u590d\u5f0f\u540420\u5143', 20],
  ['direct only amount', '\u798f123 456\u76f4\u54041\u5143', 2],
  ['group only amount', '\u798f123 456\u7ec4\u54041\u5143', 2],
  ['direct only multiplier', '\u798f123 456\u76f41\u500d', 4],
  ['group only multiplier', '\u798f123 456\u7ec4\u4e001\u500d', 4],
  ['separate direct and group segments', '\u798f123 456\u76f4\u54041\u5143，789\u7ec4\u54041\u5143', 3],
  ['组三复试 changed digits and amount', '\u798f5678\u7ec4\u4e09\u590d\u8bd5\u540425\u5143', 50],
  ['reverse order and multiplier', '\u4f539876\u590d\u8bd5\u4e0e\u7ec4\u4e09\u54042\u500d', 40],
  ['组三复式 is one play', '\u798f1234\u7ec4\u4e09\u590d\u5f0f20\u5143', 20],
  ['position field lists independent digits', '\u798f\u767e\u4f4d14\u540420\u5143', 40],
  ['position fields sum their listed digits', '\u798f\u767e\u4f4d5\u5341\u4f4d5\u5404\u625340\u5143', 80]
  ,['short dan-tuo notation is not a plain number', '\u4f530\u62d6125\u516d\u7ec410\u5143', 10]
  ,['short dan-tuo without leading marker', '0\u62d6125\u4f53\u516d\u7ec410\u5143', 10]
  ,['bare each ten on fly is money', '\u798f12 34\u53cc\u98de\u540410', 20]
  ,['bare each twenty on group six is money', '\u798f1234 5678\u7ec4\u516d\u540420', 40]
  ,['bare each twenty on direct and group is money per play', '\u4f53123 456\u76f4\u7ec4\u540420', 80]
  ,['bare each one on direct and group is multiplier', '\u798f123 456\u76f4\u7ec4\u5404\u4e00', 8]
  ,['one direct one group is multiplier', '\u798f123 456\u76f4\u4e00\u7ec4\u4e00', 8]
  ,['two direct three group is multiplier', '\u4f53123 456\u76f4\u4e8c\u7ec4\u4e09', 20]
  ,['explicit times overrides bare amount convention', '\u798f12 34\u53cc\u98de\u540410\u500d', 200]
  ,['转圈组三组六各一倍查表', '\u4f53\u8f6c\u57081234\u7ec4\u4e09\u7ec4\u516d\u5404\u4e00\u500d', 120]
  ,['组三组六转圈各一倍查表', '\u4f53\u7ec4\u4e09\u7ec4\u516d\u8f6c\u57081234\u5404\u4e00\u500d', 120]
  ,['组六组三转圈各一倍查表', '\u4f53\u7ec4\u516d\u7ec4\u4e09\u8f6c\u57081234\u5404\u4e00\u500d', 120]
  ,['沾边赖组三组六一胆各一倍查表', '\u4f53\u6cbe\u8fb9\u8d56\u7ec4\u4e09\u7ec4\u516d\u80c65\u5404\u4e00\u500d', 108]
  ,['沾边赖组三组六两胆各一倍查表', '\u4f53\u6cbe\u8fb9\u8d56\u7ec4\u4e09\u7ec4\u516d\u80c658\u5404\u4e00\u500d', 196]
];
let failed = 0;
for (const [name, text, expected] of cases) {
  const result = calculate(text);
  if (!result.confident || result.amount !== expected) {
    failed += 1;
    console.log(`FAIL ${name}: expected ${expected}, got ${result.amount}; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: ${result.amount}`);
}
process.exitCode = failed ? 1 : 0;
