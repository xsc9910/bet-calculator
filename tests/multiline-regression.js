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
  ['直加双飞', '福123 456直各1元\n双飞12 34各10元', 22],
  ['双飞加直', '福双飞12 34各10元\n123 456直各1元', 22],
  ['不同号码直选组选', '排列三直选123 456各一倍\n组选789 987各一倍', 8],
  ['组选先于直选', '排三组选789 987各一倍\n直选123 456各一倍', 8],
  ['胆码加双飞', '体独胆2 4各10元\n双飞24 26各10元', 40],
  ['双飞加胆码', '体双飞24 26各10元\n独胆2 4各10元', 40],
  ['和值加双飞', '福和值13 17各10元\n飞29各10元', 30],
  ['组六复式加双飞', '福01234组六20元\n飞29各10元', 30],
  ['双飞加组六复式', '福飞29各10元\n01234组六20元', 30],
  ['直选组选再飞', '福123 456直组各1元\n飞12各10元', 14],
  ['飞再直选组选', '福飞12各10元\n123 456直组各1元', 14],
  ['跨彩票各行独立', '福123 456直各1元\n体789 987组各2元', 6],
  ['盘别单独成行', '福\n123 456直各1元\n飞12各10元', 12],
  ['号码单独成行', '福\n123 456\n直各1元\n飞12各10元', 12],
  ['金额单独成行', '福\n123 456直\n各1元\n飞12各10元', 12],
  ['行尾小计和末尾总计', '福\n123 456直各1元 合计2元\n飞12各10元 合计10元\n共12元', 12]
];

cases.push(['slash-delimited multi group lines', '\u798f01469/\u7ec4\u4e09\u7ec4\u516d\u540410\u5143\n1469/\u7ec4\u516d\u7ec4\u4e0910\u5143\n\u517140', 40]);
cases.push(['fullwidth slash multi group lines', '\u4f5312345\uff0f\u7ec4\u516d\u7ec4\u4e09\u54045\u7c73\n6789/\u7ec4\u4e09\u7ec4\u516d5\n\u517120', 20]);
cases.push(['slash multi group multipliers', '\u798f1234/\u7ec4\u4e09\u7ec4\u516d\u54042\u500d\n5678/\u7ec4\u516d\u7ec4\u4e09\u4e00\u500d\n\u517160', 60]);
cases.push(['leading multipliers with trailing number', '\u798f\u4e24\u76f4\u4e00\u7ec4386', 6]);
cases.push(['reversed leading plays with trailing number', '\u4f53\u4e09\u7ec4\u4e24\u76f4579', 10]);
cases.push(['leading plays and multipliers with trailing number', '\u798f\u76f4\u4e24\u7ec4\u4e00386', 6]);
cases.push(['priced group block with fly and two-code group', '3D\u7ec4\u9009\n677+667\n\u540410\u5143\u540820\u5143\u3002\n\u7ec4\u516d\u53cc\u98de67\uff0c\n\u540810\u5143\u3002\n\u7ec4\u4e09\u4e24\u780167\uff0c\n\u540810\u5143\u3002\n\u603b\u8ba1\u6b3e40\u5143\u3002', 40]);
cases.push(['play then number list then multiplier', '\u798f\u76f4\n421 152 254 815 420 462 604 342 583 341\u4e00\u500d\n\u517120', 20]);
cases.push(['number list then note count lottery and group rate', '309 304 048 704 705 741 745 748 743 439 419 416 415 485 459 195 951 956 958 986 168 158 156 867 865 850 809 860 619 609\n\u6ce830\uff0c\u798f\uff0c\u7ec40.5\uff0c\u4e00\u517115', 15]);
cases.push(['multiple fixed-money group-three lines', '\u798f189\u7ec4\u4e0950\n\u798f2489\u7ec4\u4e0950', 100]);
cases.push(['repeated numbers with each before direct and group rates', '548 548\u4f53\u76f4\u54042\u7c73\u7ec4\u54041\u7c73 2\u6ce8 \u51716\u7c73', 6]);
cases.push(['plus separated spans with shared stake', '\u8de81+\u8de88\u540410\u5143\n\u540820\u5143', 20]);
cases.push(['shared direct list with one specified group pick', '\u798f440\uff0c044\uff0c404\u4e00\u76f4044\u4e00\u7ec4\u5408\u8ba18', 8]);
cases.push(['multiple wildcard positions with shared money', '\u798fx09\uff0c90x\u540410\u5143\u5408\u8ba120', 20]);
cases.push(['leading unit price before direct with subtotal', '\u4f53623.621.614.613\u4e00\u5143\u76f44\u5143', 4]);

const independentSegments = [
  ['直选', '福123 456直各1元', 2],
  ['组选', '福789 987组各1元', 2],
  ['双飞', '福飞12 34各10元', 20],
  ['独胆', '福独胆2 4各10元', 20],
  ['和值', '福和值13 17各10元', 20],
  ['组六复式', '福01234组六20元', 20],
  ['一码定位', '福百位1十位2个位345直各1元', 3],
  ['两码定位', '福X37两码定位10元', 10]
];
for (const [name, input, amount] of independentSegments) cases.push([`独立段${name}`, input, amount]);
for (let first = 0; first < independentSegments.length; first += 1) {
  for (let second = 0; second < independentSegments.length; second += 1) {
    if (first === second) continue;
    const a = independentSegments[first];
    const b = independentSegments[second];
    cases.push([`${a[0]}→${b[0]}`, `${a[1]}\n${b[1]}`, a[2] + b[2]]);
    cases.push([`${a[0]}→${b[0]}首行标盘`, `${a[1]}\n${b[1].replace(/^福/, '')}`, a[2] + b[2]]);
    for (let third = 0; third < independentSegments.length; third += 1) {
      if (third === first || third === second) continue;
      const c = independentSegments[third];
      cases.push([`${a[0]}→${b[0]}→${c[0]}首行标盘`,
        `${a[1]}\n${b[1].replace(/^福/, '')}\n${c[1].replace(/^福/, '')}`, a[2] + b[2] + c[2]]);
    }
  }
}

let failed = 0;
for (const [name, input, expected] of cases) {
  const result = calculate(input);
  if (!result.confident || result.amount !== expected) {
    failed += 1;
    console.log(`FAIL ${name}: expected ${expected}, got ${result.amount}; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: ${result.amount}`);
}
const mustClarify = [
  ['后段飞号没有额度', '福123直各1元\n飞12'],
  ['后段存在未识别玩法', '福123直各1元\n未知456各5元'],
  ['末尾未识别号码段', '福123直各1元\n飞12各10元\n乱码789']
];
for (const [name, input] of mustClarify) {
  const result = calculate(input);
  if (result.confident || result.amount !== '' || !result.needs?.length) {
    failed += 1;
    console.log(`FAIL ${name}: should request clarification; ${JSON.stringify(result)}`);
  } else console.log(`PASS ${name}: blocked with reason`);
}
console.log(`MULTILINE_SUMMARY passed=${cases.length + mustClarify.length - failed} failed=${failed}`);
process.exitCode = failed ? 1 : 0;
