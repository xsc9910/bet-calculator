const fs = require('fs');

const source = fs.readFileSync('app.js', 'utf8');
const element = () => ({
  value: '', checked: false, options: [], style: {}, className: '', textContent: '',
  classList: { toggle() {}, add() {}, remove() {} },
  closest() { return null; }, replaceChildren() {}, append() {}, setAttribute() {},
  showModal() {}, close() {}
});
const documentMock = {
  getElementById() { return element(); },
  querySelectorAll() { return []; },
  createElement() { return { click() {} }; }
};
const autoCalculateBet = Function('localStorage', 'document', 'confirm', 'navigator',
  `${source}; return autoCalculateBet;`
)({ getItem() { return null; }, setItem() {} }, documentMock, () => false,
  { clipboard: { writeText() {} } });

const cases = [
  ['直组选各一倍', '福123 456直组各一倍', 8],
  ['双飞金额后置', '双飞 34 36 39 46 49 69各2米福飞合计12', 12],
  ['单挑即直选', '单挑 436 439 639 496各2米组福合计8', 8],
  ['胆拖加直组选', '福胆2拖178三十组六170-180各三单两组', 50],
  ['全包组三固定金额', '福全包组三50元', 50],
  ['金额前置直组选', '三地708十元单十元组', 20],
  ['玩法前置直组选', '体直十元组五元708 709', 30],
  ['同一行双彩票', '三地708十元单十元组。排三569十元单十元组', 40],
  ['多行混合玩法', '双飞 34 36 39 46 49 69各2米福飞合计12\n单挑 436 439 639 496各2米组福合计8', 20],
  ['福体直组选金额后置', '福体直组135 139 158 913 075 138 118 257 618 9注各0.2米', 7.2],
  ['福彩直组选金额后置', '福直组135 139各0.2米', 0.8],
  ['体彩直选金额后置', '体直135 139 2注各0.5米', 1],
  ['福彩组选金额后置', '福组135 139各0.5米', 1]
];

let failed = false;
for (const [name, text, expected] of cases) {
  const result = autoCalculateBet(text);
  const passed = result.confident && result.amount === expected;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}: ${result.amount}，预期 ${expected}`);
  failed ||= !passed;
}
process.exitCode = failed ? 1 : 0;
