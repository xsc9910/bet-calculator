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
  ['福彩组选金额后置', '福组135 139各0.5米', 1],
  ['直组玩法在号码前', '福体直组135 139各0.2米', 1.6],
  ['直组玩法在号码中', '135 139福体直组各0.2米', 1.6],
  ['直组玩法在金额后', '135 139各0.2米福体直组', 1.6],
  ['直组选金额分别写', '福体135 139直0.2米组0.2米', 1.6],
  ['双横线显式单项金额', '福，直815--2，组158--4', 6],
  ['号码后直组倍数', '福526 585直二组一', 12],
  ['号码后单组倍数', '福526 585二单一组', 12],
  ['纯号码前置行继承玩法', `002 004 048 084 087 118 129 145 154 183 200 219 244 266 291 299 318 334 338 345 347 354 381 384 400 415 433 442 447 451 453 455 480 483 497 499 514 525 534 541 543 545 552 554 743 744 749 780 787 794 804 807 811 813 816 831 833 834 840 861 866 912 921 947 992 994
002 004 084 200 244 299 347 354 381 384 400 442 447 453 455 480 483 499 534 543 545 554 743 744 804 807 811 813 816 831 834 840 861 866 992 994福直各5角计51米
002 018 020 022 038 081 092 173 180 183 220 283 290 298 318 335 345 371 380 533 535 553 586 658 667 685 688 766 787 788体直各5角计15米
共66米`, 66]
];

let failed = false;
for (const [name, text, expected] of cases) {
  const result = autoCalculateBet(text);
  const passed = result.confident && result.amount === expected;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}: ${result.amount}，预期 ${expected}`);
  if (!passed) console.log(JSON.stringify(result));
  failed ||= !passed;
}
process.exitCode = failed ? 1 : 0;
